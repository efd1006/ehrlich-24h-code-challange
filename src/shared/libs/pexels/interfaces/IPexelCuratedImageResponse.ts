interface IPexelCuratedImageResponse {
    page: number
    per_page: number
    photos: IPexelPhoto[]
    total_results: number
    next_page: string
}