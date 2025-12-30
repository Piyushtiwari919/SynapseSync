import {Schema,model} from "mongoose";

const connectionRequestSchema = new Schema({
    fromUserId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    toUserId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:`{VALUE} is not a valid status`
        },
        required:true,
    }

},{timestamps:true});

const ConnectionRequest = model("ConnectionRequest",connectionRequestSchema);

export default ConnectionRequest;