import { Component, computed, inject, input, output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Icon } from '../icon/icon';
import { VideoRef } from '../../models/models';

export function detectPlatform(url: string): VideoRef['platform'] {
  if (/youtube\.com|youtu\.be/i.test(url)) return 'youtube';
  if (/instagram\.com/i.test(url)) return 'instagram';
  if (/tiktok\.com/i.test(url)) return 'tiktok';
  return 'other';
}

function youtubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,16})/i,
  );
  return match ? match[1] : null;
}

const PLATFORM_LABELS: Record<VideoRef['platform'], string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  other: 'קישור',
};

@Component({
  selector: 'aos-video-card',
  imports: [Icon],
  template: `
    @if (embedUrl(); as embed) {
      <div class="embed-wrap">
        <iframe
          [src]="embed"
          title="{{ video().title }}"
          allow="accelerometer; encrypted-media; picture-in-picture"
          allowfullscreen
          loading="lazy"
        ></iframe>
      </div>
      <div class="video-meta">
        <span class="video-title">{{ video().title }}</span>
        <button class="remove-btn" (click)="removed.emit()" aria-label="הסר סרטון">
          <aos-icon name="trash" />
        </button>
      </div>
    } @else {
      <div class="link-card">
        <a [href]="video().url" target="_blank" rel="noopener noreferrer">
          <aos-icon [name]="video().platform === 'other' ? 'link' : 'video'" />
          <div>
            <div class="video-title">{{ video().title }}</div>
            <div class="platform">{{ platformLabel() }} ↗</div>
          </div>
        </a>
        <button class="remove-btn" (click)="removed.emit()" aria-label="הסר סרטון">
          <aos-icon name="trash" />
        </button>
      </div>
    }
  `,
  styleUrl: './video-card.scss',
})
export class VideoCard {
  private readonly sanitizer = inject(DomSanitizer);

  readonly video = input.required<VideoRef>();
  readonly removed = output<void>();

  readonly embedUrl = computed<SafeResourceUrl | null>(() => {
    const v = this.video();
    if (v.platform !== 'youtube') return null;
    const id = youtubeId(v.url);
    if (!id) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${id}`,
    );
  });

  platformLabel(): string {
    return PLATFORM_LABELS[this.video().platform];
  }
}
