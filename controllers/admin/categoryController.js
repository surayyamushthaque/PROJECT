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
export const updateCategory = async (req, res) => {
    try {
        

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description
            },
            { new: true }
        );
        

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteCategory = async(req,res)=>{
    try{
        await Category.findByIdAndUpdate(req.params.id,{
            isDeleted:true,
        })

        return res.json({
            message:"Category deleted (soft)"
        })

    }catch(err){
        return res.status(500).json({
            error:err.message
        })
    }
}

export const getCategory = async (req,res)=>{
     
    try{
        const {search = "", page=1,limit = 5}=req.query
        const query = {
          
            name:{$regex:search,$options:"i"},
        }
        const categories = await Category.find(query)
        .sort({createdAt:-1})
        .skip((page-1)*limit)
        .limit(Number(limit))
        const total = await Category.countDocuments(query)
        
        res.status(200).json({data:categories,total,page:Number(page),pages:Math.ceil(total/limit)})
    }catch(err){
        res.status(500).json({error:err.message})
    }
}

 export const toggleCategoryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const isListed = status === "listed";

        const category = await Category.findByIdAndUpdate(
            id,
            { isListed }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category status updated",
            data: category
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
export default{
    getCategory,
    toggleCategoryStatus,
     deleteCategory,
     updateCategory,
     addCategory


}