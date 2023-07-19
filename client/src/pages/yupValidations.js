import * as yup from "yup";

export const userValidationSchema = yup.object().shape({
  username: yup
    .string()
    .required("* Required")
    .min(8, "* Min 8 characters")
    .max(20, "* Max 20 characters")
    .matches(/^\S*$/, "* No spaces"),
  password: yup
    .string()
    .required("* Required")
    .min(8, "* Min 8 characters")
    .matches(/\d/, "* At least 1 number")
    .notOneOf([yup.ref("username")], "* Cannot match username")
    .matches(/^\S*$/, "* No spaces"),
});

export const recipeValidationSchema = yup.object().shape({
  name: yup.string().required("* Required").max(40, "* Max 40 characters"),
  ingredients: yup
    .array()
    .of(yup.string().required("* Required").max(40, "* Max 40 characters"))
    .required("* Required"),
  instructions: yup.string().required("* Required").max(1000, "* Max 1000 characters"),
  imageURL: yup
    .string()
    .required("* Required")
    .matches(/^(http|https):\/\/[^ "]+$/, "* Invalid image URL"),
  cookingTime: yup.number().required().moreThan(0, "* Required"),
  userOwner: yup.string().required("* Required"),
});
