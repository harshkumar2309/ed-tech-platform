import { Tag } from "../tag/tag.model.js";
import { createTagService } from "../tag/tag.service.js";

// create tag handler
export const createTag = async (req, res) => {
    try{
        // fetch data
        const { name, description } = req.body;

        // create tag service
        const tagDetails = await createTagService(name, description);

        // return response
        return res.status(200).json({
            success: true,
            message: 'Tag created successfully!',
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}
