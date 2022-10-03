import type { Link } from '@/components/Informational/types'

export type ButtonType = 'primary' | 'secondary' | 'warning' | 'error' | 'success'
export type ButtonSize = 'lg' | 'md' | 'sm' | 'xs'

export interface Button {
    type?: ButtonType
    link?: Link
    theme?: string
    size?: ButtonSize
    iconPosition?: 'before' | 'after'
}