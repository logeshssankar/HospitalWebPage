import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
  ChangeDetectorRef,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface Service {
  number: string;
  title: string;
  description: string;
  icon: string;
  iconBackground: string;
  featured: boolean;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services implements AfterViewInit, OnDestroy {
  @ViewChild('sectionRef') sectionRef?: ElementRef<HTMLElement>;
  @ViewChild('headerRef') headerRef?: ElementRef<HTMLElement>;
  @ViewChildren('cardRef') cardRefs!: QueryList<ElementRef<HTMLElement>>;

  services: Service[] = [
    {
      number: '01',
      title: 'Emergency Care',
      description:
        'Immediate medical attention with dedicated emergency specialists available around the clock.',
      icon: 'fa-solid fa-truck-medical',
      iconBackground: '#e9f7f8',
      featured: true,
    },
    {
      number: '02',
      title: 'Cardiology',
      description:
        'Comprehensive heart care from diagnosis and prevention to advanced cardiac treatment.',
      icon: 'fa-solid fa-heart-pulse',
      iconBackground: '#eef8f3',
      featured: false,
    },
    {
      number: '03',
      title: 'Neurology',
      description:
        'Specialized diagnosis and treatment for conditions affecting the brain and nervous system.',
      icon: 'fa-solid fa-brain',
      iconBackground: '#f1effb',
      featured: false,
    },
    {
      number: '04',
      title: 'Pediatrics',
      description:
        'Gentle and specialized healthcare services designed specifically for children and infants.',
      icon: 'fa-solid fa-baby',
      iconBackground: '#fff5e8',
      featured: false,
    },
    {
      number: '05',
      title: 'Dental Care',
      description:
        'Complete dental services focused on prevention, treatment, and maintaining healthy smiles.',
      icon: 'fa-solid fa-tooth',
      iconBackground: '#edf7fb',
      featured: false,
    },
    {
      number: '06',
      title: 'Laboratory',
      description:
        'Reliable diagnostic testing with modern equipment and accurate results for better treatment.',
      icon: 'fa-solid fa-flask-vial',
      iconBackground: '#f3f7e9',
      featured: false,
    },
  ];

  headerRevealed = false;
  private headerObserver?: IntersectionObserver;
  private fallbackTimer?: ReturnType<typeof setTimeout>;

  private scrollListener?: () => void;
  private ticking = false;
  private readonly REVEAL_DISTANCE = 320;
  private readonly INDEX_STAGGER = 55;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
  ) {}

  trackByNumber(_index: number, service: Service): string {
    return service.number;
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    requestAnimationFrame(() => {
      this.setupHeaderObserver();
      this.setupScrollEffects();
    });

    this.fallbackTimer = setTimeout(() => {
      this.headerRevealed = true;
      this.cdr.markForCheck();
      this.cardRefs?.forEach((ref) => {
        ref.nativeElement.style.setProperty('--progress', '1');
        this.applyStaggeredVars(ref.nativeElement, 1);
      });
    }, 2000);
  }

  ngOnDestroy(): void {
    this.headerObserver?.disconnect();
    if (this.fallbackTimer) clearTimeout(this.fallbackTimer);
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
      window.removeEventListener('resize', this.scrollListener);
    }
  }

  private setupHeaderObserver(): void {
    const header = this.headerRef?.nativeElement;
    if (!header) return;

    this.headerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.headerRevealed = true;
            this.cdr.markForCheck();
            this.headerObserver?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );
    this.headerObserver.observe(header);
  }

  private remap(value: number, inMin: number, inMax: number): number {
    const t = (value - inMin) / (inMax - inMin);
    return Math.min(Math.max(t, 0), 1);
  }

  private applyStaggeredVars(card: HTMLElement, progress: number): void {
    const containerP = this.remap(progress, 0.0, 0.01);

    const iconP = this.remap(progress, 0.03, 0.15);

    const numberP = this.remap(progress, 0.2, 0.25);

    const titleP = this.remap(progress, 0.3, 0.35);

    const descP = this.remap(progress, 0.35, 0.4);

    const linkP = this.remap(progress, 0.4, 0.45);

    card.style.setProperty('--container-progress', `${containerP}`);
    card.style.setProperty('--icon-progress', `${iconP}`);
    card.style.setProperty('--number-progress', `${numberP}`);
    card.style.setProperty('--title-progress', `${titleP}`);
    card.style.setProperty('--desc-progress', `${descP}`);
    card.style.setProperty('--link-progress', `${linkP}`);
  }
  private setupScrollEffects(): void {
    const section = this.sectionRef?.nativeElement;
    const cards = this.cardRefs?.toArray() ?? [];

    this.scrollListener = () => {
      if (this.ticking) return;
      this.ticking = true;

      requestAnimationFrame(() => {
        const viewportH = window.innerHeight;

        if (section) {
          const sectionRect = section.getBoundingClientRect();
          const parallaxRaw = (viewportH - sectionRect.top) / (viewportH + sectionRect.height);
          const parallaxProgress = this.remap(parallaxRaw, 0, 1);
          const offset = (parallaxProgress - 0.5) * 60;
          section.style.setProperty('--parallax-offset', `${offset}px`);
        }

        cards.forEach((ref, index) => {
          const el = ref.nativeElement;
          const rect = el.getBoundingClientRect();

          const revealLine = viewportH * 0.9 - index * this.INDEX_STAGGER;
          const progress = this.remap(revealLine - rect.top, 0, this.REVEAL_DISTANCE);

          el.style.setProperty('--progress', `${progress}`);
          this.applyStaggeredVars(el, progress);
        });

        this.ticking = false;
      });
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
    window.addEventListener('resize', this.scrollListener, { passive: true });
    this.scrollListener();
  }

  selectService(serviceName: string): void {
    console.log(`Selected service: ${serviceName}`);
    this.scrollToAppointment();
  }

  scrollToAppointment(): void {
    const section = document.getElementById('appointment');
    section?.scrollIntoView({ behavior: 'smooth' });
  }
}
