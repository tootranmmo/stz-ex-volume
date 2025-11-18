#!/usr/bin/env python3
"""
Icon Generator for STZ Ex Volume Checker Extension
Generates 16x16, 48x48, and 128x128 PNG icons
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont

def create_icon(size, output_path):
    """
    Create a simple icon with a magnifying glass design
    size: int - icon size in pixels (16, 48, or 128)
    output_path: str - path to save the PNG file
    """

    # Create image with cyan/blue gradient-like background
    img = Image.new('RGBA', (size, size), (0, 212, 255, 0))
    draw = ImageDraw.Draw(img)

    # Calculate proportions based on size
    margin = max(1, size // 10)
    circle_size = size - (margin * 2)
    circle_pos = (margin, margin, margin + circle_size, margin + circle_size)

    # Colors
    primary_color = (0, 212, 255, 255)      # Cyan
    primary_dark = (0, 152, 204, 255)       # Dark cyan
    accent_color = (255, 107, 157, 255)     # Pink

    # Draw background circle
    draw.ellipse(circle_pos, fill=primary_color, outline=primary_dark, width=max(1, size // 16))

    # Draw magnifying glass design
    # Circle (lens)
    lens_margin = max(2, size // 8)
    lens_pos = (
        margin + lens_margin,
        margin + lens_margin,
        margin + circle_size - lens_margin,
        margin + circle_size - lens_margin
    )
    draw.ellipse(lens_pos, fill=None, outline=accent_color, width=max(1, size // 20))

    # Handle (diagonal line)
    handle_start_x = margin + circle_size - lens_margin
    handle_start_y = margin + circle_size - lens_margin
    handle_end_x = size - margin
    handle_end_y = size - margin
    draw.line(
        [(handle_start_x, handle_start_y), (handle_end_x, handle_end_y)],
        fill=accent_color,
        width=max(1, size // 20)
    )

    # Draw inner detail circles for volume bars effect
    if size >= 48:
        inner_circle = (
            margin + lens_margin + max(2, size // 12),
            margin + lens_margin + max(2, size // 12),
            margin + circle_size - lens_margin - max(2, size // 12),
            margin + circle_size - lens_margin - max(2, size // 12)
        )
        draw.ellipse(inner_circle, fill=None, outline=accent_color, width=1)

    # Save the icon
    img.save(output_path, 'PNG')
    print(f'✓ Created {output_path} ({size}x{size})')

def create_icons():
    """Generate all icon sizes"""

    base_dir = os.path.dirname(os.path.abspath(__file__))
    icons_dir = os.path.join(base_dir, 'extension/src/icons')

    # Ensure directory exists
    os.makedirs(icons_dir, exist_ok=True)

    sizes = [16, 48, 128]

    print('🎨 Generating extension icons...')
    print('-' * 40)

    try:
        for size in sizes:
            output_path = os.path.join(icons_dir, f'icon-{size}.png')
            create_icon(size, output_path)

        print('-' * 40)
        print('✅ All icons generated successfully!')
        return True

    except ImportError:
        print('❌ Error: PIL/Pillow is not installed')
        print('Install with: pip install Pillow')
        return False
    except Exception as e:
        print(f'❌ Error generating icons: {e}')
        return False

if __name__ == '__main__':
    success = create_icons()
    sys.exit(0 if success else 1)
