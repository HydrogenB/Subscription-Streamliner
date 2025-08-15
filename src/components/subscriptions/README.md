# Monthly Summary Bottom Sheet Component

This component implements a mobile-first bottom sheet that displays a monthly subscription service summary, exactly matching the UI design from the reference image.

## Features

- **Exact UI Match**: Pixel-perfect implementation of the reference design
- **Thai Language Support**: All text is in Thai as shown in the design
- **Mobile-First Design**: Optimized for mobile devices with proper touch interactions
- **Responsive Layout**: Adapts to different screen sizes
- **Smooth Animations**: CSS transitions for opening/closing
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Usage

```tsx
import { MonthlySummaryBottomSheet } from '@/components/subscriptions/MonthlySummaryBottomSheet';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        Open Summary
      </button>
      
      <MonthlySummaryBottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | `boolean` | Yes | Controls whether the bottom sheet is visible |
| `onClose` | `() => void` | Yes | Callback function when the sheet should close |
| `className` | `string` | No | Additional CSS classes for customization |

## UI Elements

### 1. Handle and Collapse Icon
- Light gray horizontal handle bar
- Red chevron down icon for closing
- Centered at the top of the sheet

### 2. Header Section
- Title: "สรุปค่าบริการรายเดือน" (Summary of Monthly Services)
- Promotional banner with gradient background (red to purple)
- Text: "ส่วนลดสูงสุด 367 บาท เมื่อเลือกสูงสุด 4 แอป"

### 3. Services List
- Section title: "บริการของคุณ" (Your Services)
- Bullet points for each service with prices
- Additional text about adding more services

### 4. Total Cost
- Label: "ค่าบริการ (ไม่รวมภาษีมูลค่าเพิ่ม)"
- Large red price display

### 5. Progress Indicator
- Horizontal line with red segment (75% filled)
- Three red dots along the red segment
- Gray segment for remaining progress

### 6. Action Button
- Full-width red button
- Text: "ถัดไป" (Next)
- Rounded corners with shadow

## Styling

The component uses Tailwind CSS classes and includes:
- Proper spacing and typography
- Color scheme matching the design
- Shadow effects and rounded corners
- Gradient backgrounds
- Responsive sizing

## Demo

Visit `/demo/monthly-summary` to see the component in action.

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Desktop browsers (Chrome, Firefox, Safari, Edge)
