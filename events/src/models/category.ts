import mongoose from "mongoose";

//* An interface that describes the properties
//* that are required to create a new Category
interface CategoryAttrs {
    name: string;
}

//* An interface that describes the properties
//* that a Category document model has
interface CategoryDoc extends mongoose.Document {
    id: string;
    name: string;
}

//* An interface that describes the properties
//* that a Category model has
interface CategoryModel extends mongoose.Model<CategoryDoc> {
    build(attrs: CategoryAttrs): CategoryDoc;
}

//* Category Schema
//* {title, description, location, createdAt, imageUrl, startDateTime, endDateTime, price, isFree, url, category, organizer, toJSON()}
const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

//* Function to create new Category.
//* using it instead of 'new Category' to add type check
categorySchema.statics.build = (attrs: CategoryAttrs) => {
    return new Category(attrs);
};

const Category = mongoose.model<CategoryDoc, CategoryModel>("Category", categorySchema);

export { Category };
