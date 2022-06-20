import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('reset_password_requests')
export class ResetPasswordRequestEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'text'
  })
  user_id: string

  @Column({
    type: 'text'
  })
  password_reset_token: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}