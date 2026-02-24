import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "./index";

interface ItemAttributes {
    ID: number;
    PrettyName: string;
    Image: string;
    Description: string;
    Value: number;
}

type ItemCreationAttributes = Optional<ItemAttributes, "ID">;

export class Item extends Model<ItemAttributes, ItemCreationAttributes>
    implements ItemAttributes {
    declare ID: number;
    declare PrettyName: string;
    declare Image: string;
    declare Description: string;
    declare Value: number;
}

Item.init(
    {
        ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        PrettyName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Value: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "Items",
        timestamps: false,
    }
);
