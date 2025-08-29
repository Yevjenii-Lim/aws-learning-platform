# Screenshot Feature for Tutorials

## Overview

The tutorial system now supports optional screenshots for each step, making tutorials more visual and easier to follow. Screenshots are stored in AWS S3 and displayed alongside console and CLI instructions.

## Features

### For Admins (Content Creators)

1. **Upload Screenshots**: Add screenshots to any tutorial step during creation or editing
2. **Image Preview**: See uploaded screenshots immediately in the form
3. **Easy Removal**: Remove screenshots with a single click
4. **File Validation**: Automatic validation for image files (PNG, JPG) and size limits (5MB max)

### For Users (Learners)

1. **Visual Guides**: See screenshots alongside console instructions
2. **CLI Reference**: View screenshots in CLI mode for visual context
3. **Responsive Display**: Screenshots adapt to different screen sizes
4. **Optional Feature**: Tutorials work perfectly without screenshots

## How to Use

### Adding Screenshots in Admin Panel

1. Navigate to the Admin Panel
2. Create or edit a tutorial
3. For each step, scroll to the "Screenshot (Optional)" section
4. Click the upload area or drag an image file
5. Wait for upload to complete
6. The screenshot will appear with a preview
7. Use the X button to remove if needed

### Technical Details

#### File Requirements
- **Formats**: PNG, JPG, JPEG
- **Size Limit**: 5MB maximum
- **Storage**: AWS S3 bucket
- **URL Structure**: `https://bucket.s3.amazonaws.com/screenshots/{serviceId}/{tutorialId}/step-{stepId}.png`

#### Data Structure
```typescript
interface Step {
  id: number;
  title: string;
  description: string;
  consoleInstructions: string[];
  cliCommands: string[];
  tips: string[];
  screenshot?: string; // S3 URL of the uploaded image
}
```

#### API Endpoints
- **Upload**: `POST /api/tutorials/upload-screenshot`
  - Accepts: FormData with file, serviceId, tutorialId, stepId
  - Returns: `{ success: true, imageUrl: string }`

#### S3 Integration
- **Bucket**: `aws-learning-platform-content` (configurable via env var)
- **Path**: `screenshots/{serviceId}/{tutorialId}/step-{stepId}.png`
- **Caching**: 24-hour cache headers for performance

## Benefits

1. **Enhanced Learning**: Visual learners can follow along more easily
2. **Reduced Confusion**: Screenshots show exactly what users should see
3. **Professional Quality**: Tutorials look more polished and complete
4. **Flexible**: Optional feature doesn't break existing tutorials
5. **Scalable**: S3 storage handles any number of screenshots

## Best Practices

### For Screenshots
- Use high-quality, clear images
- Capture the most relevant part of the AWS console
- Keep file sizes reasonable (under 2MB for faster loading)
- Use consistent naming conventions
- Test on different screen sizes

### For Tutorial Creation
- Add screenshots for complex or confusing steps
- Use screenshots to highlight important UI elements
- Consider adding screenshots for both console and CLI views
- Update screenshots when AWS UI changes

## Troubleshooting

### Common Issues
1. **Upload Fails**: Check file size and format
2. **Image Not Displaying**: Verify S3 bucket permissions
3. **Slow Loading**: Optimize image size before upload
4. **Permission Errors**: Ensure AWS credentials are configured

### Environment Variables
```bash
AWS_S3_BUCKET=aws-learning-platform-content
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
```

## Future Enhancements

- Image compression and optimization
- Multiple screenshots per step
- Screenshot annotations and highlights
- Video support for complex workflows
- Screenshot versioning for UI changes
