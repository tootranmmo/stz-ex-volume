# Extension Icons

This directory contains all the icons used by the STZ Ex Volume Checker extension.

## Icon Files

### PNG Icons (Auto-generated)
- `icon-16.png` - 16×16 pixels (browser toolbar)
- `icon-48.png` - 48×48 pixels (Chrome Web Store)
- `icon-128.png` - 128×128 pixels (Chrome Web Store details)

### SVG Source
- `icon.svg` - Vector icon source (can be edited and regenerated)

## Design

The icon features:
- **Primary Color**: Cyan (#00D4FF) - Main circle background
- **Secondary Color**: Pink (#FF6B9D) - Magnifying glass and details
- **Design Elements**:
  - Magnifying glass (search concept)
  - Volume bars (volume check concept)
  - Concentric circles for visual interest

## Regenerating Icons

If you modify the design, regenerate PNG icons using the Python script:

```bash
python3 icon-generator.py
```

### Requirements
- Python 3
- Pillow library: `pip install Pillow`

## Icon Sizes Explanation

| Size | Usage |
|------|-------|
| 16×16 | Browser toolbar (action popup icon) |
| 48×48 | Chrome Web Store listing |
| 128×128 | Chrome Web Store details page |

## Customization

To customize the icon design:

1. **Edit SVG File**: Modify `icon.svg` directly
2. **Update Python Script**: Edit `icon-generator.py` to change colors/design
3. **Regenerate PNGs**: Run `python3 icon-generator.py`
4. **Test**: Reload extension in `chrome://extensions/`

## Color Palette

```
Primary Blue:     #00D4FF
Primary Dark:     #0098CC
Secondary Pink:   #FF6B9D
White:           #FFFFFF
Transparent:     rgba(0, 0, 0, 0)
```

## Notes

- All icons use RGBA format for transparency
- Minimum size: 16×16 (very small, keep simple)
- Maximum size: 128×128 (detailed)
- SVG can be scaled to any size
- PNG icons are pre-rendered for exact pixel sizes

---

**Version**: 1.0.0
**Last Updated**: November 2024
