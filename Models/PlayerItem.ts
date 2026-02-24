import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "./index";
import { Player } from "./Player";
import { Item } from "./Item";

interface PlayerItemAttributes {
    ID: number;
    PlayerGUID: string;
    ItemID: number;
}

type PlayerItemCreationAttributes = Optional<PlayerItemAttributes, "ID">;

export class PlayerItem extends Model<PlayerItemAttributes, PlayerItemCreationAttributes>
    implements PlayerItemAttributes {
    declare ID: number;
    declare PlayerGUID: string;
    declare ItemID: number;
}

PlayerItem.init(
    {
        ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        PlayerGUID: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Player,
                key: "GUID",
            },
        },
        ItemID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Item,
                key: "ID",
            },
        },
    },
    {
        sequelize,
        tableName: "PlayersItems",
        timestamps: false,
    }
);

// Associations
Player.hasMany(PlayerItem, { foreignKey: "PlayerGUID" });
PlayerItem.belongsTo(Player, { foreignKey: "PlayerGUID" });

Item.hasMany(PlayerItem, { foreignKey: "ItemID" });
PlayerItem.belongsTo(Item, { foreignKey: "ItemID" });
