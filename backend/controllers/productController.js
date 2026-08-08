// function for add product 
import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestSeller } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {
                    resource_type: 'image',
                })
                return result.secure_url
            })
        )

        const productData = {
            name, 
            description,
            category,
            price: Number(price),
            subCategory,
            bestSeller: bestSeller === 'true' ? true : false,
            sizes: JSON.parse(sizes),
            images: imagesUrl,
            date: Date.now()
        }

        const product = new productModel(productData)
        await product.save()

        res.json({
            success: true,
            message: 'Product added successfully',
            product
        })
    } catch(error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: 'Failed to add product',
            error: error.message
        })
    }
}

// function for get all products
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({})
        res.json({
            success: true,
            products
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve products',
            error: error.message
        })
    }   
}

// function for remove product
const removeProduct = async (req, res) => {
    try {
       await productModel.findByIdAndDelete(req.body.id)
       res.json({success: true, message: 'Product removed successfully'})

    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: 'Failed to remove product',
            error: e.message
        })
    }
}

// function for get single product
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body
        const product = await productModel.findById(productId)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }
        res.json({
            success: true,
            product
        })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve product',
            error: error.message
        })
    }
}

export { addProduct, listProducts, removeProduct, singleProduct }