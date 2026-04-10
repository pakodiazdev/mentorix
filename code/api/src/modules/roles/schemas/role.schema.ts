import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Role extends Document {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Permission" }] })
  permissions!: Types.ObjectId[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
