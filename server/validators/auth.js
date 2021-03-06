const { check } = require('express-validator');

exports.userRegisterValidator = [
  check('name')
    .not()
    .isEmpty()
    .isLength({ max: 20 })
    .withMessage('Name is required'),
  check('email').isEmail().withMessage('Must be valid email'),
  check('password')
    .isLength({ min: 8 })
    .isLength({ max: 30 })
    .withMessage('Password must be at least 8 characters'),
];

exports.userLoginValidator = [
  check('email').isEmail().withMessage('Must be valid email'),
  check('password')
    .isLength({ min: 8 })
    .isLength({ max: 30 })
    .withMessage('Password must be at least 8 characters'),
];

exports.forgotPasswordValidator = [
  check('email').isEmail().withMessage('Must be valid email'),
];

exports.resetPasswordValidator = [
  check('newPassword')
    .isLength({ min: 8 })
    .isLength({ max: 30 })
    .withMessage('Password must be at least 8 characters'),
  check('resetPasswordLink').not().isEmail().withMessage('Token is required'),
];

exports.userUpdateValidator = [
  check('name').not().isEmpty().withMessage('Name is required'),
];
