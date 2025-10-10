import Image, { ImageProps } from 'next/image';

/**
 * Optimized Image Component
 * 
 * Wrapper around next/image with pre-configured sizes for common use cases
 * 
 * Usage:
 * <OptimizedImage
 *   src="/images/hero.jpg"
 *   alt="Hero image"
 *   width={1200}
 *   height={600}
 *   priority // for above-the-fold images
 * />
 */

interface OptimizedImageProps extends Omit<ImageProps, 'sizes'> {
  /**
   * Size variant for the image
   * - 'icon': Small icons (16-64px)
   * - 'thumbnail': Thumbnails (64-128px)
   * - 'card': Card images (256-384px)
   * - 'content': Content images (640-1080px)
   * - 'hero': Hero/banner images (1080-1920px)
   * - 'full': Full width images (100vw)
   */
  sizeVariant?: 'icon' | 'thumbnail' | 'card' | 'content' | 'hero' | 'full';
}

const SIZE_CONFIGS = {
  icon: '(max-width: 768px) 32px, 64px',
  thumbnail: '(max-width: 768px) 64px, 128px',
  card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px',
  content: '(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 1080px',
  hero: '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1920px',
  full: '100vw',
};

export function OptimizedImage({
  sizeVariant = 'content',
  ...props
}: OptimizedImageProps) {
  const sizes = SIZE_CONFIGS[sizeVariant];

  return (
    <Image
      {...props}
      sizes={sizes}
      // Enable modern image formats
      placeholder={props.placeholder || 'blur'}
      blurDataURL={props.blurDataURL || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='}
    />
  );
}

/**
 * Avatar Image Component
 * Optimized for user avatars
 */
export function AvatarImage({
  src,
  alt,
  size = 40,
  ...props
}: Omit<ImageProps, 'width' | 'height' | 'sizes'> & { size?: number }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      sizes={`${size}px`}
      className="rounded-full"
      {...props}
    />
  );
}

/**
 * Logo Image Component
 * Optimized for logos
 */
export function LogoImage({
  src,
  alt,
  width = 120,
  height = 40,
  ...props
}: Omit<ImageProps, 'sizes'>) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes="(max-width: 768px) 100px, 120px"
      priority // Logos are usually above the fold
      {...props}
    />
  );
}

/**
 * Product/Deal Image Component
 * Optimized for product cards
 */
export function ProductImage({
  src,
  alt,
  ...props
}: Omit<ImageProps, 'sizes'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      sizeVariant="card"
      {...props}
    />
  );
}

