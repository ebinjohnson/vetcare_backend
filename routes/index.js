const express = require("express");
const app = express();
var router = express.Router();
const Razorpay = require("razorpay");
const fileupload = require("express-fileupload");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
var users = require("./model/userModel");
var hospitals = require("./model/hospital");
var appointments = require("./model/appointment");
var userdetails = require("./model/userModel");
var vaccinelist = require("./model/vaccinelist");
var VaccineBooking = require("./model/vaccineBooking");
var complaints = require("./model/complaintbox");
var products = require("./model/products");
var order = require("./model/order");
var cart = require("./model/cart");
var categories = require("./model/category");
var bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
dotenv.config();
const client = require("twilio")(accountSid, authToken);
app.use(fileupload());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("files"));
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Ebin" });
});

router.post("/register", async (req, res, next) => {
  var user = new users({
    username: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
  });
  var response = await user.save();
  //console.log(response);
  if (response) {
    res.status(200).json({ response });
  } else {
    res.status(401).json({ status: "failed" });
  }
});
router.post("/login", async (req, res, next) => {
  try {
    //validation
    if (!req.body.email || !req.body.password)
      return res.status(400).json({
        status: false,
        message: "Validation Failed",
      });

    const user = await users.findOne({
      email: req.body.email,
    });

    if (user.status === "active") {
      console.log(user);
      if (!user)
        return res.status(404).json({
          status: false,
          message: "User does not exist",
        });
      const pwdMatch = await bcrypt.compare(req.body.password, user.password);

      if (!pwdMatch)
        return res.status(401).json({
          status: false,
          message: "Password Incorrect",
        });

      const token = jwt.sign(
        { userid: user._id, email: user.email },
        process.env.SECRET_CODE,
        { expiresIn: "1d" }
      );
      res.status(200).send({
        token: token,
        username: user.username,
        role: user.role,
        id: user._id,
        userphone: user.phone,
        useremail: user.email,
      });
    } else {
      return res.status(500).send({
        message: "User Denied",
      });
    }
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: "Something went wrong",
      data: err,
    });
  }
});
router.post("/addhospital", async (req, res, next) => {
  console.log(req.body);
  var hospital = new hospitals({
    hospitalName: req.body.hname,
    hospitalEmail: req.body.hemail,
    hospitalPhone: req.body.hphone,
    hospitalAddress: req.body.haddress,
    hospitalPincode: req.body.hpin,
    hospitalType: req.body.htype,
  });
  var response = await hospital.save();
  //console.log(response);
  if (response) {
    res.status(200).json({ response });
  } else {
    res.status(401).json({ status: "failed" });
  }
});
router.post("/appointments", async (req, res, next) => {
  console.log(req.body);
  var appointment = new appointments({
    AppointName: req.body.aname,
    AppointPhone: req.body.aphone,
    AppointPet: req.body.apet,
    AppointHospital: req.body.ahospital,
    AppointDate: req.body.adate,
    AppointTime: req.body.atime,
    userId: req.body.id,
  });
  var response = await appointment.save();
  //console.log(response);
  if (response) {
    res.status(200).json({ response });
  } else {
    res.status(401).json({ status: "failed" });
  }
});

router.get("/gethospital", async (req, res) => {
  await hospitals
    .find({ status: "active" })
    .exec()
    .then((response) => {
      console.log(response);
      if (response) {
        res.status(200).json({ hospitals: response });
      } else {
        res.status(401).json({ status: "failed" });
      }
    });
});
router.get("/getusers", async (req, res) => {
  await userdetails
    .find()
    .exec()
    .then((response) => {
      console.log(response);
      if (response) {
        res.status(200).json({ userdetails: response });
      } else {
        res.status(401).json({ status: "failed" });
      }
    });
});

//Delete a User
router.post("/deleteUser", async (req, res, next) => {
  let userID = req.body.userID;
  let userStatus = {
    status: "inactive",
  };
  users
    .findByIdAndUpdate(userID, { $set: userStatus })
    .then((user) => {
      return res.status(200).send({
        message: "User Deleted Successfully",
      });
    })
    .catch((error) => {
      return res.status(500).send({
        message: error.message,
      });
    });
});
//Reactivate a User
router.post("/activateUser", async (req, res, next) => {
  let userID = req.body.userID;
  let userStatus = {
    status: "active",
  };
  users
    .findByIdAndUpdate(userID, { $set: userStatus })
    .then((user) => {
      return res.status(200).send({
        message: "User ReActivated",
      });
    })
    .catch((error) => {
      return res.status(500).send({
        message: error.message,
      });
    });
});
router.get("/getappointment", async (req, res) => {
  await appointments
    .find()
    .exec()
    .then((response) => {
      console.log(response);
      if (response) {
        res.status(200).json({ appointments: response });
      } else {
        res.status(401).json({ status: "failed" });
      }
    });
});
router.post("/getActiveappointment", async (req, res) => {
  await appointments
    .find({ userId: req.body.id })
    .exec()
    .then((response) => {
      if (response) {
        res.status(200).json({ appointments: response });
      } else {
        res.status(401).json({ status: "failed" });
      }
    });
});
router.post("/cancelappointment", async (req, res, next) => {
  let appointmentID = req.body.appointmentID;
  let userStatus = {
    status: "canceled",
  };
  appointments
    .findByIdAndUpdate(appointmentID, { $set: userStatus })
    .then((user) => {
      return res.status(200).send({
        message: "Canceled Successfully",
      });
    })
    .catch((error) => {
      return res.status(500).send({
        message: error.message,
      });
    });
});
router.post("/hospitalLogin", async (req, res, next) => {
  const hospital = await hospitals
    .findOne({
      hospitalEmail: req.body.email,
    })
    .then((response) => {
      if (response.hospitalPhone == req.body.phone) {
        return res.status(200).send({
          message: response,
        });
      } else {
        return res.status(500).send({
          message: "Incorrect Password",
        });
      }
    })
    .catch((error) => {
      return res.status(500).send({
        message: error.message,
      });
    });
});
router.post("/vaccinelist", async (req, res, next) => {
  var Vaccine = new vaccinelist({
    hospitalId: req.body.hid,
    hospitalName: req.body.hname,
    vaccineName: req.body.vname,
    vaccineAnimal: req.body.vanimal,
    vaccineDate: req.body.vdate,
    vaccineNumber: req.body.vnumber,
  });
  var response = await Vaccine.save();
  //console.log(response);
  if (response) {
    res.status(200).json({ response });
  } else {
    res.status(401).json({ status: "failed" });
  }
});
router.post("/bookVaccine", async (req, res, next) => {
  var Vaccine = new VaccineBooking({
    hospitalId: req.body.hid,
    hospitalName: req.body.hname,
    vaccineName: req.body.vname,
    vaccineAnimal: req.body.vanimal,
    vaccineDate: req.body.vdate,
    userId: req.body.userId,
    userName: req.body.userName,
  });
  var response = await Vaccine.save();
  //console.log(response);
  if (response) {
    res.status(200).json({ response });
  } else {
    res.status(401).json({ status: "failed" });
  }
});
router.get("/getvaccinelist", async (req, res) => {
  await vaccinelist
    .find()
    .exec()
    .then((response) => {
      console.log(response);
      if (response) {
        res.status(200).json({ appointments: response });
      } else {
        res.status(401).json({ status: "failed" });
      }
    });
});
router.post("/complaints", async (req, res, next) => {
  var newComplaints = new complaints({
    userEmail: req.body.c_email,
    userPhone: req.body.c_phone,
    doi: req.body.c_date,
    subject: req.body.c_sub,
    location: req.body.c_location,
    description: req.body.c_desc,
    userId: req.body.id,
  });
  var response = await newComplaints.save();
  //console.log(response);
  if (response) {
    res.status(200).json({ response });
  } else {
    res.status(401).json({ status: "failed" });
  }
});

router.get("/getcomplaints", async (req, res) => {
  await complaints
    .find()
    .exec()
    .then((response) => {
      if (response) {
        res.status(200).json({ complaints: response });
      } else {
        res.status(401).json({ status: "failed" });
      }
    });
});
router.post("/getcomplaintstatus", async (req, res) => {
  await complaints
    .find({ userId: req.body.id })
    .exec()
    .then((response) => {
      if (response) {
        res.status(200).json({ complaints: response });
      } else {
        res.status(401).json({ status: "failed" });
      }
    });
});

router.post("/addcategory", async (req, res, next) => {
  var newCategories = new categories({
    catName: req.body.catname,
  });
  var response = await newCategories.save();
  //console.log(response);
  if (response) {
    res.status(200).json({ response });
  } else {
    res.status(401).json({ status: "failed" });
  }
});
router.get("/getcategory", async (req, res) => {
  await categories
    .find()
    .exec()
    .then((response) => {
      if (response) {
        res.status(200).json({ categories: response });
      } else {
        res.status(401).json({ status: "failed" });
      }
    });
});
//Changepassword
router.post("/changepassword", async (req, res, next) => {
  try {
    const user = await users.findOne({ username: req.body.username });
    bcrypt.compare(req.body.oldPassword, user.password, function (err, result) {
      if (err) {
        return res.status(500).send({
          error: err,
          val: req.body.oldPassword,
        });
      }
      if (result) {
        bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
          if (err) {
            return res.status(500).send({
              message: err,
            });
          }
          let updateduser = {
            password: hashedPass,
          };
          users
            .findByIdAndUpdate(user.id, { $set: updateduser })
            .then((user) => {
              return res.status(200).send({
                message: "Password Changed Successfully",
              });
            })
            .catch((error) => {
              return res.status(500).send({
                message: error.message,
              });
            });
        });
      } else {
        return res.status(500).send({
          message: "Password Mismatch",
        });
      }
    });
    ////////////////
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
});

// router.post("/addproduct", async (req, res, next) => {
//   let imgArr = [];
//   if (req.files) {
//     let productImage = req.files.imagelink;
//     productImage.forEach((cover) => {
//       let coverName = Date.now();
//       cover.mv(
//         "C:/Users/ebin/Desktop/Vetcare/Vetcare/Node-basic/routes/Images/" +
//           coverName +
//           ".jpeg"
//       );
//       imgArr.push(coverName + ".jpeg");
//     });
//   }
//   let newProducts = new products({
//     productCategory: req.body.ctname,
//     productName: req.body.name,
//     productPrice: req.body.price,
//     productDescription: req.body.desc,
//     productQuantity: req.body.quantity,
//     productImage: imgArr,
//   });
//   var response = await newProducts.save();
//   //console.log(response);
//   if (response) {
//     res.status(200).json({ response });
//   } else {
//     res.status(401).json({ status: "failed" });
//   }
// });

router.post("/addproduct", async (req, res) => {
  let Product = new products({
    productCategory: req.body.ctname,
    productName: req.body.name,
    productPrice: req.body.price,
    productDescription: req.body.desc,
    productQuantity: req.body.quantity,
  });

  Product.save()
    .then((product) => {
      return res.status(200).send({
        message: product,
      });
    })
    .catch((error) => {
      return res.status(500).send({
        message: error.message,
      });
    });
});

//get hospital by id
router.post("/getHospitalByID", async (req, res) => {
  await hospitals
    .find({ _id: req.body.hospitalId })
    .exec()
    .then((response) => {
      if (response) {
        res.status(200).json({ hospitals: response });
      } else {
        res.status(401).json({ status: "failed" });
      }
    });
});

//update hospital details
router.post("/updatehospital", async (req, res, next) => {
  let hospitalID = req.body.hospitalId;
  let hospitalStatus = {
    hospitalName: req.body.hname,
    hospitalEmail: req.body.hemail,
    hospitalPhone: req.body.hphone,
    hospitalAddress: req.body.haddress,
    hospitalPincode: req.body.hpin,
    hospitalType: req.body.htype,
  };
  hospitals
    .findByIdAndUpdate(hospitalID, { $set: hospitalStatus })
    .then((user) => {
      return res.status(200).send({
        message: "Updated Successfully",
      });
    })
    .catch((error) => {
      return res.status(500).send({
        message: error.message,
      });
    });
});
router.post("/deletehospital", async (req, res, next) => {
  let hospitalID = req.body.hospitalID;
  let userStatus = {
    status: "inactive",
  };
  hospitals
    .findByIdAndUpdate(hospitalID, { $set: userStatus })
    .then((user) => {
      return res.status(200).send({
        message: "Hospital Deleted Successfully",
      });
    })
    .catch((error) => {
      return res.status(500).send({
        message: error.message,
      });
    });
});
router.post("/cancelhospitalappointment", async (req, res, next) => {
  let appointmentID = req.body.appointmentID;
  let userStatus = {
    status: "canceled",
  };
  appointments
    .findByIdAndUpdate(appointmentID, { $set: userStatus })
    .then((user) => {
      return res.status(200).send({
        message: "Canceled Successfully",
      });
    })
    .catch((error) => {
      return res.status(500).send({
        message: error.message,
      });
    });
});

router.get("/getproducts", async (req, res) => {
  await products
    .find()
    .exec()
    .then((response) => {
      if (response) {
        res.status(200).json({ products: response });
      } else {
        res.status(401).json({ status: "failed" });
      }
    });
});
router.get("/getuserproducts", async (req, res) => {
  await products
    .find()
    .exec()
    .then((response) => {
      if (response) {
        res.status(200).json({ products: response });
      } else {
        res.status(401).json({ status: "failed" });
      }
    });
});
router.post("/searchproducts", async (req, res) => {
  let searchname = req.body.search;
  await products
    .find({ productName: new RegExp("^" + searchname + "$", "i") })
    .exec()
    .then((response) => {
      if (response) {
        res.status(200).json({ products: response });
      } else {
        res.status(401).json({ status: "failed" });
      }
    });
});
router.post("/sortcategory", async (req, res) => {
  let catName = req.body.catName;
  await products
    .find({ productCategory: new RegExp("^" + catName + "$", "i") })
    .exec()
    .then((response) => {
      if (response) {
        res.status(200).json({ products: response });
      } else {
        res.status(401).json({ status: "failed" });
      }
    });
});
router.post("/getonlyActiveappointment", async (req, res) => {
  await appointments
    .find({ status: "active" })
    .exec()
    .then((response) => {
      if (response) {
        res.status(200).json({ appointments: response });
      } else {
        res.status(401).json({ status: "failed" });
      }
    });
});

router.post("/addtocart", async (req, res, next) => {
  let userID = req.body.userId;
  let userCart = await cart.findOne(
    { userId: userID } && { productId: req.body.productId }
  );
  if (userCart && userCart.status == "pending") {
    let cartId = userCart._id;
    let quantity = {
      quantity: userCart.quantity + 1,
    };
    cart
      .findByIdAndUpdate(cartId, { $set: quantity })
      .then((response) => {
        return res.status(200).send({
          message: "Quantity Changed",
        });
      })
      .catch((error) => {
        return res.status(500).send({
          message: error.message,
        });
      });
  } else {
    var newcart = new cart({
      userId: req.body.userId,
      productId: req.body.productId,
      quantity: req.body.quantity,
    });

    var response = await newcart.save();
    //console.log(response);
    if (response) {
      res.status(200).json({ response });
    } else {
      res.status(401).json({ status: "failed" });
    }
  }
});

router.post("/getcartitems", async (req, res) => {
  await cart
    .find({ userId: req.body.userId })
    .populate("productId")
    .exec()
    .then((response) => {
      if (response) {
        var cartData = response.map((p) => {
          return p;
        });
        res.status(200).json({ cart: cartData });
      } else {
        res.status(401).json({ status: "failed" });
      }
    });
});
router.post("/removefromcart", async (req, res, next) => {
  await cart
    .findByIdAndRemove({ _id: req.body.cartId })
    .then((response) => {
      if (response) {
        res.status(200).send({
          message: "Item Removed",
        });
      }
    })
    .catch((error) => {
      return res.status(500).send({
        message: error.message,
      });
    });
});
//
router.post("/removeproducts", async (req, res, next) => {
  console.log(req.body.productId);
  let productId = req.body.productId;
  let productstatus = {
    status: "outofstock",
  };
  products
    .findByIdAndUpdate(productId, { $set: productstatus })
    .then((response) => {
      return res.status(200).send({
        message: "Status Changed",
      });
    })
    .catch((error) => {
      return res.status(500).send({
        message: error.message,
      });
    });
});

router.post("/addquantity", async (req, res, next) => {
  let cartId = req.body.cartId;
  let quantity = {
    quantity: req.body.quantity + 1,
  };
  cart
    .findByIdAndUpdate(cartId, { $set: quantity })
    .then((response) => {
      return res.status(200).send({
        message: "Quantity Changed",
      });
    })
    .catch((error) => {
      return res.status(500).send({
        message: error.message,
      });
    });
});
router.post("/emptycart", async (req, res, next) => {
  let cartId = req.body.cartId;
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;
  let updatestatus = {
    status: "ordered",
    orderDate: dateTime,
  };
  cart
    .findByIdAndUpdate(cartId, { $set: updatestatus })
    .then((response) => {
      console.log(response);
      return res.status(200).send({
        message: "Quantity Changed",
      });
    })
    .catch((error) => {
      return res.status(500).send({
        message: error.message,
      });
    });
});

router.post("/removequantity", async (req, res, next) => {
  let cartId = req.body.cartId;
  let quantity = {
    quantity: req.body.quantity - 1,
  };
  cart
    .findByIdAndUpdate(cartId, { $set: quantity })
    .then((response) => {
      return res.status(200).send({
        message: "Quantity Changed",
      });
    })
    .catch((error) => {
      return res.status(500).send({
        message: error.message,
      });
    });
});

//cancel order
router.post("/cancelorder", async (req, res, next) => {
  let cartId = req.body.cartId;
  let updateStatus = {
    status: "cancelled",
  };
  cart
    .findByIdAndUpdate(cartId, { $set: updateStatus })
    .then((response) => {
      return res.status(200).send({
        message: "Order Cancelled",
      });
    })
    .catch((error) => {
      return res.status(500).send({
        message: error.message,
      });
    });
});

//update stock
router.post("/updatestock", async (req, res, next) => {
  let productdata = req.body.productId;
  let stock = req.body.stock;
  let oldquantity = req.body.oldquantity;
  let quantity = {
    productQuantity: oldquantity - stock,
  };
  products
    .findByIdAndUpdate(productdata, { $set: quantity })
    .then((response) => {
      return res.status(200).send({
        message: "Order Cancelled",
      });
    })
    .catch((error) => {
      return res.status(500).send({
        message: error.message,
      });
    });
});
router.post("/otpAuthentication", async (req, res) => {
  try {
    let register_status = false;
    let mob = req.body.mobile;
    let mobno = `+${91}` + mob;
    client.verify
      .services(process.env.service_id)
      .verifications.create({
        to: mobno,
        channel: "sms",
      })
      .then((status) => {
        if (status) {
          register_status = true;
          res.status(200).json({ status: register_status });
        }
      })
      .catch((err) => console.log("error", err));
  } catch (error) {
    console.log(error.message);
  }
});

//order payment
app.get("/get-razorpay-key", (req, res) => {
  res.send({ key: process.env.RAZORPAY_KEY_ID });
});

//create-order

app.post("/create-order", async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    const options = {
      amount: req.body.amount,
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    if (!order) return res.status(500).send("Some Error Occured");
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/pay-order", async (req, res) => {
  try {
    const { amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } =
      req.body;
    const newPayment = order({
      isPaid: true,
      amount: amount,
      razorpay: {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      },
    });
    await newPayment.save();
    res.send({
      msg: "Payment was Successfull",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
app.get("/list-orders", async (req, res) => {
  const orders = await Order.find();
  res.send(orders);
});

module.exports = router;
