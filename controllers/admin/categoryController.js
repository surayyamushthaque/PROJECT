import  category from "../../models/category.js"

export const addCategory= async(req,res)=>{
    try{
        const category = new category(req.body)
        await category .save()
        res.json(category)
    }catch(err){
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
            isDeleted: false,
            name:{$regex:search,$options:"i"},
        }
        const categories = await category.find(query)
        .sort({createdAt:-1})
        .skip((page-1)*limit)
        .limit(Number(limit))
        const total = await category.countDocuments(query)
        res.json({data:cotegories,total,page:Number(page),pages:Math.ceil(total/limit)})
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