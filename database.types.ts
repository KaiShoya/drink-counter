export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      drink_counters: {
        Row: {
          count: number
          created_at: string
          date: string
          drink_id: number
          id: number
          user_id: string
        }
        Insert: {
          count: number
          created_at?: string
          date: string
          drink_id: number
          id?: number
          user_id?: string
        }
        Update: {
          count?: number
          created_at?: string
          date?: string
          drink_id?: number
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'drink_counters_drink_id_fkey'
            columns: ['drink_id']
            isOneToOne: false
            referencedRelation: 'drinks'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'drink_counters_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      drink_labels: {
        Row: {
          color: string | null
          created_at: string
          default_drink_id: number | null
          id: number
          name: string
          sort: number | null
          standard_amount: number
          user_id: string
          visible: boolean
        }
        Insert: {
          color?: string | null
          created_at?: string
          default_drink_id?: number | null
          id?: number
          name: string
          sort?: number | null
          standard_amount?: number
          user_id?: string
          visible?: boolean
        }
        Update: {
          color?: string | null
          created_at?: string
          default_drink_id?: number | null
          id?: number
          name?: string
          sort?: number | null
          standard_amount?: number
          user_id?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'public_drink_labels_default_drink_id_fkey'
            columns: ['default_drink_id']
            isOneToOne: false
            referencedRelation: 'drinks'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_drink_labels_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      drinks: {
        Row: {
          amount: number
          color: string | null
          created_at: string
          drink_label_id: number | null
          id: number
          name: string
          sort: number | null
          user_id: string | null
          visible: boolean
        }
        Insert: {
          amount?: number
          color?: string | null
          created_at?: string
          drink_label_id?: number | null
          id?: number
          name: string
          sort?: number | null
          user_id?: string | null
          visible?: boolean
        }
        Update: {
          amount?: number
          color?: string | null
          created_at?: string
          drink_label_id?: number | null
          id?: number
          name?: string
          sort?: number | null
          user_id?: string | null
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'drinks_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_drinks_drink_label_id_fkey'
            columns: ['drink_label_id']
            isOneToOne: false
            referencedRelation: 'drink_labels'
            referencedColumns: ['id']
          },
        ]
      }
      user_settings: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: number
          name: string | null
          switching_timing: number
          threshold_for_detecting_overdrinking: number
          timezone: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: number
          name?: string | null
          switching_timing?: number
          threshold_for_detecting_overdrinking?: number
          timezone?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: number
          name?: string | null
          switching_timing?: number
          threshold_for_detecting_overdrinking?: number
          timezone?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      aggregation_by_dow: {
        Args: {
          year?: number
          month?: number
        }
        Returns: {
          dow: number
          sum_count: number
          avg_count: number
          max_type_of_drinks: number
          avg_type_of_drinks: number
          record_count: number
        }[]
      }
      aggregation_by_drink_labels: {
        Args: {
          year?: number
          month?: number
        }
        Returns: {
          drink_label_id: number
          count: number
        }[]
      }
      bulk_update_drink_labels_sort: {
        Args: {
          payload: Json
        }
        Returns: undefined
      }
      bulk_update_drinks_sort: {
        Args: {
          payload: Json
        }
        Returns: undefined
      }
      decrement: {
        Args: {
          row_id: number
        }
        Returns: number
      }
      delete_drink_data: {
        Args: {
          drinkid: number
        }
        Returns: undefined
      }
      get_user_settings: {
        Args: Record<PropertyKey, never>
        Returns: {
          threshold_for_detecting_overdrinking: number
          timezone: string
          switching_timing: number
        }[]
      }
      increment: {
        Args: {
          row_id: number
        }
        Returns: number
      }
      sum_count: {
        Args: Record<PropertyKey, never>
        Returns: {
          drink_id: number
          count: number
        }[]
      }
      sum_count_per_month: {
        Args: {
          year: number
          month: number
        }
        Returns: {
          drink_id: number
          count: number
        }[]
      }
      sum_count_per_year: {
        Args: {
          year: number
        }
        Returns: {
          drink_id: number
          count: number
        }[]
      }
      update_threshold_for_detecting_overdrinking:
      | {
        Args: {
          threshold: number
        }
        Returns: undefined
      }
      | {
        Args: {
          threshold: number
          tz: string
          timing: number
        }
        Returns: undefined
      }
      update_user_settings: {
        Args: {
          threshold: number
          tz: string
          timing: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'objects_bucketId_fkey'
            columns: ['bucket_id']
            isOneToOne: false
            referencedRelation: 'buckets'
            referencedColumns: ['id']
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: 's3_multipart_uploads_bucket_id_fkey'
            columns: ['bucket_id']
            isOneToOne: false
            referencedRelation: 'buckets'
            referencedColumns: ['id']
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: 's3_multipart_uploads_parts_bucket_id_fkey'
            columns: ['bucket_id']
            isOneToOne: false
            referencedRelation: 'buckets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 's3_multipart_uploads_parts_upload_id_fkey'
            columns: ['upload_id']
            isOneToOne: false
            referencedRelation: 's3_multipart_uploads'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
    Database[PublicTableNameOrOptions['schema']]['Views'])
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
    Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
    PublicSchema['Views'])
  ? (PublicSchema['Tables'] &
    PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof PublicSchema['Tables']
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof PublicSchema['Tables']
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof PublicSchema['Enums']
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
  : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never
