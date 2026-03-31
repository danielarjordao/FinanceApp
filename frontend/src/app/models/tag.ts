export interface Tag {
  id: string;
  profile_id: string;
  name: string;
  color?: string;
  created_at?: string;
}

export interface TagListResponse {
  status: string;
  data: Tag[];
}

export interface TagResponse {
  status: string;
  data: Tag;
}

export interface TagDeleteResponse {
  status: string;
  message: string;
}
