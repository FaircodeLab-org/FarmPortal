// const Product = require('../models/Product');

// exports.create = async (req,res)=>{
//   const doc = await Product.create({ ...req.body, supplier:req.user._id });
//   res.json({ success:true, product:doc });
// };

// exports.list = async (req,res)=>{
//   const rows = await Product.find({ supplier:req.user._id })
//                             .populate('landPlots','name plot_id');
//   res.json({ success:true, products:rows });
// };

// exports.update = async (req,res)=>{
//   const doc = await Product.findOneAndUpdate(
//     { _id:req.params.id, supplier:req.user._id },
//     req.body,{ new:true });
//   if(!doc) return res.status(404).json({ error:'Product not found' });
//   res.json({ success:true, product:doc });
// };

// exports.remove = async (req,res)=>{
//   await Product.deleteOne({ _id:req.params.id, supplier:req.user._id });
//   res.json({ success:true });
// };
const Product = require('../models/Product');

exports.create  = (req,res)=> Product.create({...req.body,supplier:req.user._id})
                     .then(p=>res.json({success:true,product:p}));

exports.list    = (req,res)=> Product.find({ supplier:req.user._id })
                     .then(rows=>res.json({success:true,products:rows}));

exports.update  = (req,res)=> Product.findOneAndUpdate(
                     { _id:req.params.id, supplier:req.user._id },
                     req.body,{new:true})
                     .then(doc=>res.json({success:true,product:doc}));

exports.remove  = (req,res)=> Product.deleteOne(
                     {_id:req.params.id,supplier:req.user._id})
                     .then(()=>res.json({success:true}));