const router = require("express").Router()
const getmemberteam = require('../lib/getPlateformMemberTeam')
const auth = require("../lib/auth")

router.get('/:tel', auth, getmemberteam.GetTeamMember)

module.exports = router