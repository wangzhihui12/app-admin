import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("device", { schema: "app_admin" })
export class Device {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("datetime", { name: "create_time" })
  createTime: Date;

  @Column("varchar", { name: "sn", length: 20 })
  sn: string;
}
