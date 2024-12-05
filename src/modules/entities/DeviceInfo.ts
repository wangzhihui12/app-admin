import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("device_info", { schema: "app_admin" })
export class DeviceInfo {
  @PrimaryGeneratedColumn({ type: "int", name: "id", comment: "主键,自增" })
  id: number;

  @Column("varchar", { name: "device_sn", length: 20 })
  deviceSn: string;

  @Column("varchar", {
    name: "user",
    nullable: true,
    comment: "使用者(员工)",
    length: 20,
  })
  user: string | null;

  @Column("tinyint", {
    name: "status",
    nullable: true,
    comment: "0:废弃;1:离线;2:在线",
  })
  status: number | null;

  @Column("datetime", {
    name: "last_log_upload_time",
    nullable: true,
    comment: "最后一次日志上传时间",
  })
  lastLogUploadTime: Date | null;

  @Column("date", {
    name: "last_log_remove_time",
    nullable: true,
    comment: "最后一次清除日志日期",
  })
  lastLogRemoveTime: string | null;
}
