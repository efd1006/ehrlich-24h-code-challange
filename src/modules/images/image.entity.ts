import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('images')
export class ImageEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'uuid'
  })
  owner_id: string

  @Column({
    type: 'int',
    default: 1
  })
  hits: number

  @Column({
    type: 'text'
  })
  uri: string

  @Column({
    type: 'text'
  })
  cloudinary_public_id: string

  @DeleteDateColumn()
  deletedAt: Date
}