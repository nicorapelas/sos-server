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
      res.json({ error: `The name "${name}", is already taken` })
      return
    }
    const community = new Community({
      _user: req.user._id,
      name,
      adminId: req.user._id,
    })
    await community.save()
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          community: {
            name: community.name,
            communityId: community._id,
            adminId: community.adminId,
          },
        },
      },
      { new: true }
    )
    res.json({
      _id: community._id,
      communityId: community._id,
      name: community.name,
    })
    return
  } catch (error) {
    console.log(error)
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
      const user = await User.findById({ _id: adminId })
      res.json(user)
    } catch (error) {
      console.log(error)
      return
    }
  }
)

router.post('/create-community-invite', requireAuth, async (req, res) => {
  const { communityId } = req.body
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
        // Fetch the user object
        const user = await User.findById(req.user._id)
        // Check if the user is already a member of the community
        const isMember = user.community.some(
          (community) => community.communityId === communityInvite.communityId
        )
        if (isMember) {
          res.json({ error: 'User is already a member of the community.' })
          return
        } else {
          await User.findByIdAndUpdate(
            req.user._id,
            {
              $push: {
                community: {
                  name: community.name,
                  communityId: community._id,
                  adminId: community.adminId,
                },
              },
            },
            { new: true }
          )
          // Logic to add user to the community if not already a member
          // This could involve updating the User document to add the community
          // to their list, and potentially other business logic as needed.

          // Example: Adding communityInvite details to the user's community array
          // user.community.push({
          //   name: communityInvite.name, // Assuming the CommunityInvite contains a name field
          //   communityId: communityInvite.communityId,
          //   adminId: req.user._id, // or another appropriate field
          // });
          // await user.save(); // Save the updated user object

          res.json(communityInvite) // or another appropriate response
        }
      }
    }
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ error: 'An error occurred while joining the community.' })
  }
})

// router.post('/join-community', requireAuth, async (req, res) => {
//   const { pin } = req.body
//   try {
//     const communityInvite = await CommunityInvite.findOne({ pin })
//     if (!communityInvite) {
//       res.json({ error: 'pin invalid, or expired' })
//       return
//     }
//     if (communityInvite && communityInvite.date) {
//       const inviteDate = new Date(communityInvite.date)
//       const currentDate = new Date()
//       const differenceInHours = (currentDate - inviteDate) / (1000 * 60 * 60)
//       if (differenceInHours > 24) {
//         await CommunityInvite.findByIdAndDelete(communityInvite._id)
//         res.json({ error: 'pin invalid, or expired' })
//         return
//       } else {
//         const user = await User.findByIdAndUpdate(req.user._id, {

//         })
//         res.json(communityInvite)
//       }
//     }
//   } catch (error) {
//     console.log(error)
//     return
//   }
// })

module.exports = router
