import { Type, Layout, MousePointerClick, Heart, Music, Image as ImageIcon, Gift, Key, Sparkles, PenTool } from 'lucide-react'

export const CMS_CATEGORIES = [
    {
        id: 'hero',
        title: 'Hero Section',
        icon: Layout,
        keys: [
            { key: 'hero_title', label: 'Main Title', type: 'text' },
            { key: 'hero_subtitle', label: 'Subtitle', type: 'text' },
            { key: 'scroll_down_text', label: 'Scroll Hint (Top)', type: 'text' },
            { key: 'scroll_karo_text', label: 'Scroll Hint (Bottom)', type: 'text' }
        ]
    },
    {
        id: 'timeline',
        title: 'Love Story',
        icon: Heart,
        keys: [
            { key: 'timeline_title', label: 'Section Title', type: 'text' }
        ]
    },
    {
        id: 'wishbox',
        title: 'Wish Box',
        icon: Sparkles,
        keys: [
            { key: 'wishbox_title', label: 'Badge Text', type: 'text' },
            { key: 'wishbox_heading', label: 'Main Heading', type: 'text' },
            { key: 'wishbox_subheading', label: 'Subheading', type: 'textarea' },
            { key: 'wishbox_input_label', label: 'Input Label', type: 'text' },
            { key: 'wishbox_placeholder', label: 'Placeholder', type: 'text' },
            { key: 'wishbox_btn_text', label: 'Button Text', type: 'text' },
            { key: 'wishbox_success_title', label: 'Success Title', type: 'text' },
            { key: 'wishbox_success_sender', label: 'Sender Name', type: 'text' },
            { key: 'wishbox_again_btn', label: 'Play Again Button', type: 'text' }
        ]
    },
    {
        id: 'surprise',
        title: 'Surprise / Gift',
        icon: Gift,
        keys: [
            { key: 'surprise_title', label: 'Surprise Heading', type: 'text' },
            { key: 'scratch_prompt', label: 'Scratch Hint', type: 'text' },
            { key: 'scratch_prize', label: 'Prize Text', type: 'text' },
            { key: 'gift_shop_title', label: 'Gift Shop Title', type: 'text' },
            { key: 'gift_shop_subtitle', label: 'Gift Shop Subtitle', type: 'text' }
        ]
    },
    {
        id: 'media',
        title: 'Media & Gallery',
        icon: ImageIcon,
        keys: [
            { key: 'media_title', label: 'Video Section Title', type: 'text' },
            { key: 'audio_title', label: 'Audio Section Title', type: 'text' },
            { key: 'gallery_title', label: 'Gallery Title', type: 'text' }
        ]
    },
    {
        id: 'guestbook',
        title: 'Guest Wishes',
        icon: PenTool,
        keys: [
            { key: 'wishes_title', label: 'Section Title', type: 'text' }
        ]
    },
    {
        id: 'message',
        title: 'Love Letter / Message',
        icon: Type,
        keys: [
            { key: 'long_letter_title', label: 'Letter Title', type: 'text' },
            { key: 'long_letter_body', label: 'Letter Body', type: 'textarea' },
            { key: 'message_title', label: 'Final Message Title', type: 'text' },
            { key: 'message_body', label: 'Final Message Body', type: 'textarea' }
        ]
    },
    {
        id: 'footer',
        title: 'Footer & Secrets',
        icon: Key,
        keys: [
            { key: 'footer_text', label: 'Footer Text', type: 'text' },
            { key: 'secret_vault_title', label: 'Vault Title', type: 'text' },
            { key: 'secret_vault_hint', label: 'Vault Hint', type: 'text' },
        ]
    }
]
