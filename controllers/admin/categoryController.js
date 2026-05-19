import  Category from "../../models/category.js"

export const addCategory= async(req,res)=>{
    try{
        console.log(req.body)
        const category = new Category(req.body)
        await category.save()
        res.status(200).json({category})
    }catch(err){
        console.log(err)
            res.status(500).json({error:err.message})
     }
}

export const updateCategory = async(req,res)=>{
    try{
        const category = await category.findByIdAndUpdate(
            req.params.id,req.body,{new:true}
        )
        res.json(category)
    }catch(err){
        res.status(500).json({error:err.message})
    }

}

export const deleteCategory = async(req,res)=>{
    try{
        await category.findByIdAndUpdate(req.params.id,{
            isDeleted:true,
        })
        res.json({message:"Category deleted (soft)"})
    }catch(err){
        res.status(500).json({error:err.message})
    }
}

export const getCategory = async (req,res)=>{
    try{
        const {search = "", page=1,limit = 5}=req.query
        const query = {
           isListed: true,
            name:{$regex:search,$options:"i"},
        }
        const categories = await Category.find(query)
        .sort({createdAt:-1})
        .skip((page-1)*limit)
        .limit(Number(limit))
        const total = await Category.countDocuments(query)
        console.log(categories)
        res.status(200).json({data:categories,total,page:Number(page),pages:Math.ceil(total/limit)})
    }catch(err){
        res.status(500).json({error:err.message})
    }
}

export default{
    getCategory,
     deleteCategory,
     updateCategory,
     addCategory


}