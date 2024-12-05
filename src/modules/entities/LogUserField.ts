import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { LogConfig } from "./LogConfig";

@Index("FK_log_user_field_log_config", ["configId"], {})
@Entity("log_user_field", { schema: "app_admin" })
export class LogUserField {
  @PrimaryGeneratedColumn({ type: "int", name: "id", comment: "主键,自增" })
  id: number;

  @Column("varchar", { name: "name", comment: "字段名", length: 20 })
  name: string;

  @Column("int", { name: "config_id", nullable: true })
  configId: number | null;

  @ManyToOne(() => LogConfig, (logConfig) => logConfig.logUserFields, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "config_id", referencedColumnName: "id" }])
  config: LogConfig;
}
