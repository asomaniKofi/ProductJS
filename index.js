/**
 * Variables
 */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
const Product = require('./Model/Product');
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const uri = "mongodb+srv://dbAdmin:Jaceaaron9606@locations.8w0yr.mongodb.net/ColletionItems?retryWrites=true&w=majority";
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  secure: true,
  port: 465,
  auth:{
      user:'brooklynkidNYB@gmail.com',
      pass:'yk2015kl'
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  }
});
let mailOptions = {
        from :"brooklynkidNYB@gmail.com",
        to:"donotreplytrashscanner@gmail.com",
        subject:"Error Logging",
        text:""
};
mongoose.connect(uri);

app.set('port', PORT);
app.set('env', NODE_ENV);
app.use(logger('tiny'));
app.use(bodyParser.json());

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

app.listen(PORT, () => {
  console.log(
    `Express Server started on Port ${app.get(
      'port'
    )} | Environment : ${app.get('env')}`
  );
});

app.route("/api/product").post(function(req,res){
    if(req.body){
        Product.create({
            ProductID: Number(req.body.ProductID),
            ProductName: req.body.ProductName,
            Material: req.body.Material
        },(err, result)=>{
            if(err){
              mailOptions.text = `${err.message}`;
              transporter.sendMail(mailOptions,function(error,info){
                if(error){
                    console.log(error);
                }
              });
              res.send(`${err.message}`)
            }else{
              res.send("Product Added No Hassle")
            }
        });
    }else{
      mailOptions.text = `Error with request: Body is incorrect format`;
      transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error);
        }
      });
    }
});

app.get("/api/product/?",(req,res,next)=>{
    if(req.query){
        try{
            Product.findOne({"ProductID":req.query.barcode}, (err, product)=>{
                if(err){
                  mailOptions.text = `${err.message}`;
                  transporter.sendMail(mailOptions,function(error,info){
                    if(error){
                        console.log(error);
                    }
                  });
                    res.send(err.message);
                    return;
                  }
                  if(product){
                    const data = product.toJSON();
                    res.send(data);
                    return;
                  }
            });
        }catch(e){
          mailOptions.text = `${e}`;
          transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error);
            }
          });
        }
    }else{
      mailOptions.text = `${e}`;
      transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error);
        }
      });
        res.send("Somethings gone wrong with the request");
    }
});