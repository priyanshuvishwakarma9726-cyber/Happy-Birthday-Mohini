import { Type, Layout, MousePointerClick, Heart, Music, Image as ImageIcon, Gift, Key, Sparkles, PenTool } from 'lucide-react'

export const CMS_CATEGORIES = [
    {
        id: 'hero',
        title: 'Hero / Top Section',
        icon: Layout,
        keys: [
            { key: 'hero_title', label: 'Main Big Heading (Happy Bday...)', type: 'text' },
            { key: 'hero_subtitle', label: 'Sub-title (Small Text)', type: 'text' },
            { key: 'scroll_down_text', label: 'Floating Tag (Scroll Down...)', type: 'text' },
            { key: 'scroll_karo_text', label: 'Bottom Scroll Hint (Next Section)', type: 'text' }
        ]
    },
    {
        id: 'wishbox',
        title: 'Magic Wish Box (Auto-Reply Section)',
        icon: Sparkles,
        keys: [
            { key: 'wishbox_title', label: 'Floating Badge (e.g. MAGIC)', type: 'text' },
            { key: 'wishbox_heading', label: 'Box Heading', type: 'text' },
            { key: 'wishbox_subheading', label: 'Box Sub-heading / Description', type: 'textarea' },
            { key: 'wishbox_input_label', label: 'Input Field Label', type: 'text' },
            { key: 'wishbox_placeholder', label: 'Input Placeholder Hint', type: 'text' },
            { key: 'wishbox_btn_text', label: 'Submit Button Text', type: 'text' },
            { key: 'wishbox_success_title', label: 'Reply Box: Success Title', type: 'text' },
            { key: 'wishbox_success_sender', label: 'Reply Box: Sender Name', type: 'text' },
            { key: 'wishbox_again_btn', label: 'Back/Reset Button Text', type: 'text' }
        ]
    },
    {
        id: 'surprise',
        title: 'Gift & Scratch Cards',
        icon: Gift,
        keys: [
            { key: 'surprise_title', label: 'Main Surprise Heading', type: 'text' },
            { key: 'scratch_prize_1', label: 'Gift 1: Secret Message (Near Cake)', type: 'text' },
            { key: 'scratch_prompt_1', label: 'Gift 1: Scratch Me! Text', type: 'text' },
            { key: 'scratch_subtext_1', label: 'Gift 1: Bottom Helper Hint', type: 'text' },
            { key: 'scratch_prize_2', label: 'Gift 2: Secret Message (Fun Zone)', type: 'text' },
            { key: 'scratch_prompt_2', label: 'Gift 2: Scratch Me! Text', type: 'text' },
            { key: 'scratch_subtext_2', label: 'Gift 2: Bottom Helper Hint', type: 'text' },
        ]
    },
    {
        id: 'giftshop',
        title: 'Digital Shop Items',
        icon: Gift,
        keys: [
            { key: 'gift_shop_title', label: 'Shop Section Title', type: 'text' },
            { key: 'gift_shop_subtitle', label: 'Shop Section Subtitle', type: 'text' },
            { key: 'card_message', label: 'Printable Card: Special Message', type: 'textarea' },
            { key: 'card_image_url', label: 'Printable Card: Image URL (Upload Below)', type: 'text' }
        ]
    },
    {
        id: 'media',
        title: 'Media Titles',
        icon: ImageIcon,
        keys: [
            { key: 'media_title', label: 'Video Player Title', type: 'text' },
            { key: 'audio_title', label: 'Voice Note Title', type: 'text' },
            { key: 'gallery_title', label: 'Photo Gallery Title', type: 'text' }
        ]
    },
    {
        id: 'message',
        title: 'Letters & Final Wishes',
        icon: Type,
        keys: [
            { key: 'long_letter_title', label: 'Love Letter Title', type: 'text' },
            { key: 'long_letter_body', label: 'Love Letter Body', type: 'textarea' },
            { key: 'message_title', label: 'Final Surprise Box Title', type: 'text' },
            { key: 'message_body', label: 'Final Message Content', type: 'textarea' }
        ]
    },
    {
        id: 'footer',
        title: 'Bottom & Secret Vault',
        icon: Key,
        keys: [
            { key: 'footer_text', label: 'Footer Bottom Text', type: 'text' },
            { key: 'secret_vault_title', label: 'Vault Box Title', type: 'text' },
            { key: 'secret_vault_hint', label: 'Vault Password Hint (DDMM)', type: 'text' },
        ]
    }
]
