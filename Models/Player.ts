import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "./index";

interface PlayerAttributes {
    GUID: string;
    Prestige: number;
}

// Both GUID and Prestige have defaults, so both are optional on creation
type PlayerCreationAttributes = Optional<PlayerAttributes, "GUID" | "Prestige">;

export class Player extends Model<PlayerAttributes, PlayerCreationAttributes>
    implements PlayerAttributes {
    declare GUID: string;
    declare Prestige: number;
}

Player.init(
    {
        GUID: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        Prestige: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        tableName: "Players",
        timestamps: false,
    }
);
