const express = require('express')
const router = express.Router()
const Community = require('../models/Community')
const User = require('../models/User')
const CommunityInvite = require('../models/CommunityInvite')
const requireAuth = require('../middlewares/requireAuth')

router.get('/fetch', requireAuth, async (req, res) => {
  try {
    const community = await Community.find({ _user: req.user._id })
    res.json(community)
  } catch (error) {
    console.log(error)
    return
  }
})

router.post('/create', requireAuth, async (req, res) => {
  const { name } = req.body
  try {
    const nameCheck = await Community.find({ name })
    if (nameCheck.length > 0) {
      res.json({ error: `The name "${name}" is already taken` })
      return
    }
    const community = new Community({
      _user: req.user._id,
      name,
      adminId: [req.user._id],
    })
    await community.save()
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          community: {
            name: community.name,
            communityId: community._id,
            isAdmin: true,
          },
        },
      },
      { new: true }
    )
    res.json({
      success: 'communityCreatedSuccefully',
      communityList: updatedUser.community,
    })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'An error occurred while creating the community' })
  }
})

router.post('/fetch-selected', requireAuth, async (req, res) => {
  const { id } = req.body
  try {
    const community = await Community.findById({ _id: id })
    res.json(community)
  } catch (error) {
    console.log(error)
    return
  }
})

router.post(
  '/fetch-community-selected-admin',
  requireAuth,
  async (req, res) => {
    const { adminId } = req.body
    try {
      if (Array.isArray(adminId) && adminId.length) {
        const users = await User.find({ _id: { $in: adminId } })
        res.json(users)
      } else {
        res.status(400).json({ error: 'Invalid adminId format' })
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
)

router.post('/create-community-invite', requireAuth, async (req, res) => {
  const { communityId, name, adminId } = req.body
  const randomNumber =
    Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000
  try {
    const checkNumber = await CommunityInvite.find({ pin: randomNumber })
    if (checkNumber.length > 0) {
      res.json({ retry: true })
      return
    }
    const communityInvite = new CommunityInvite({
      pin: randomNumber,
      communityId,
      name,
      adminId,
    })
    await communityInvite.save()
    res.json(communityInvite)
  } catch (error) {
    console.log(error)
    return
  }
})

router.post('/fetch-community-invite', requireAuth, async (req, res) => {
  const { communityId } = req.body
  try {
    const communityInvite = await CommunityInvite.findOne({
      communityId: communityId,
    })
    if (communityInvite && communityInvite.date) {
      const inviteDate = new Date(communityInvite.date)
      const currentDate = new Date()
      const differenceInHours = (currentDate - inviteDate) / (1000 * 60 * 60)
      if (differenceInHours > 24) {
        await CommunityInvite.findByIdAndDelete(communityInvite._id)
        res.json(null)
        return
      }
    }
    res.json(communityInvite)
  } catch (error) {
    console.log(error)
    res.json(error)
  }
})

router.post('/join-community', requireAuth, async (req, res) => {
  const { pin } = req.body
  try {
    const communityInvite = await CommunityInvite.findOne({ pin })
    if (!communityInvite) {
      res.json({ error: 'pin invalid, or expired' })
      return
    }
    if (communityInvite && communityInvite.date) {
      const inviteDate = new Date(communityInvite.date)
      const currentDate = new Date()
      const differenceInHours = (currentDate - inviteDate) / (1000 * 60 * 60)
      if (differenceInHours > 24) {
        await CommunityInvite.findByIdAndDelete(communityInvite._id)
        res.json({ error: 'pin invalid, or expired' })
        return
      } else {
        const user = await User.findById(req.user._id)
        const isMember = user.community.some(
          (community) => community.communityId === communityInvite.communityId
        )
        if (isMember) {
          res.json({ error: 'User is already a member of the community.' })
          return
        } else {
          const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
              $push: {
                community: {
                  name: communityInvite.name,
                  communityId: communityInvite.communityId,
                  adminId: communityInvite.adminId,
                },
              },
            },
            { new: true }
          )
          res.json({
            success: 'joinedSuccessfully',
            communityList: updatedUser.community,
          })
        }
      }
    }
  } catch (error) {
    res.json({ error: 'An error occurred while joining the community.' })
  }
})

router.post('/fetch-community-members-list', requireAuth, async (req, res) => {
  const { _id } = req.body
  try {
    const users = await User.find({
      community: {
        $elemMatch: { communityId: _id },
      },
    })
    res.json(users)
  } catch (error) {
    res.json('Internal Server Error')
  }
})

router.post('/set-members-admin-status', requireAuth, async (req, res) => {
  const { memberAdmin, memberId, communityId } = req.body
  try {
    const result = await User.updateOne(
      {
        _id: memberId,
        'community.communityId': communityId,
      },
      {
        $set: {
          'community.$.isAdmin': memberAdmin,
        },
      }
    )
    if (memberAdmin) {
      await Community.updateOne(
        { _id: communityId },
        { $addToSet: { adminId: memberId } }
      )
    }
    if (!memberAdmin) {
      await Community.updateOne(
        { _id: communityId },
        { $pull: { adminId: memberId } }
      )
    }
    if (result.nModified === 0) {
      return res.status(404).json({
        message: 'User or community not found, or no update required.',
      })
    } else {
      const adminUsers = await User.find({
        'community.communityId': communityId,
        'community.isAdmin': true,
      })
      return res.status(200).json(adminUsers)
    }
  } catch (error) {
    console.error('Error updating admin status:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.post('/set-mute', requireAuth, async (req, res) => {
  const { mute, memberId } = req.body
  try {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: memberId },
      {
        mute,
      },
      { new: true }
    )
    res.json([updatedUser])
  } catch (error) {
    console.error('Error updating admin status:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.post('/exit-community', requireAuth, async (req, res) => {
  const { communityId } = req.body
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    const community = await Community.findById(communityId)
    if (!community) {
      return res.status(404).json({ error: 'Community not found' })
    }
    const isMember = user.community.some(
      (c) => c.communityId.toString() === communityId
    )
    if (!isMember) {
      return res.json({ error: 'User is not a member of this community.' })
    }
    const isAdmin = community.adminId.some(
      (adminId) => adminId.toString() === req.user._id.toString()
    )
    if (isAdmin) {
      await Community.findByIdAndUpdate(communityId, {
        $pull: {
          adminId: req.user._id,
        },
      })
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: {
          community: {
            communityId: communityId,
          },
        },
      },
      { new: true }
    )
    res.json({
      success: 'successfullyLeft',
      communityList: updatedUser.community,
      isAdminRemoved: isAdmin,
    })
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while leaving the community.' })
  }
})

module.exports = router
