interface IPexelPhoto {
  id: number
  width: number
  height: number
  url: string
  photographer: string
  photographer_url: string
  photographer_id: string
  avg_color: string
  src: IPexelPhotoSRC
  liked: boolean
  alt: string
}

interface IPexelPhotoSRC {
  original: string
  large2x: string
  large: string
  medium: string
  small: string
  portrait: string
  landscape: string
  tiny: string
}