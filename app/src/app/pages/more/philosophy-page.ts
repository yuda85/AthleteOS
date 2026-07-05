import { Component } from '@angular/core';
import { Icon } from '../../shared/icon/icon';
import {
  PHILOSOPHY_TAGLINE,
  PHILOSOPHY_INTRO,
  PHILOSOPHIES,
  PILLARS,
  DAILY_CHAIN,
  CLOSING_LINE,
} from '../../data/philosophy.data';

@Component({
  selector: 'aos-philosophy-page',
  imports: [Icon],
  templateUrl: './philosophy-page.html',
  styleUrl: './philosophy-page.scss',
})
export class PhilosophyPage {
  readonly tagline = PHILOSOPHY_TAGLINE;
  readonly intro = PHILOSOPHY_INTRO;
  readonly philosophies = PHILOSOPHIES;
  readonly pillars = PILLARS;
  readonly chain = DAILY_CHAIN;
  readonly closingLine = CLOSING_LINE;
}
