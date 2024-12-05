import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LogUserField } from "./LogUserField";

@Entity("log_config", { schema: "app_admin" })
export class LogConfig {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", {
    name: "device_sn",
    comment: "设备ID,device表sn",
    length: 50,
  })
  deviceSn: string;

  @Column("tinyint", {
    name: "log_saved_days",
    nullable: true,
    comment: "日志保留天数",
    default: () => "'7'",
  })
  logSavedDays: number | null;

  @OneToMany(() => LogUserField, (logUserField) => logUserField.config)
  logUserFields: LogUserField[];
}
