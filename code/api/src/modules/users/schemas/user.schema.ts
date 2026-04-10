import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  lastname!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Role" }] })
  roles!: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
