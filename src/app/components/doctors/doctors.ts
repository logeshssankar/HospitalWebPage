import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';

import {
  Doctor,
  DoctorService
} from '../service/doctor.service';

import {
  AppointmentSelectionService
} from '../service/appointment-selection.service';


@Component({
  selector: 'app-doctors',

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './doctors.html',

  styleUrl: './doctors.css',
})
export class Doctors
  implements AfterViewInit, OnDestroy {


  // =====================================================
  // SECTION
  // =====================================================

  @ViewChild('doctorsSection')
  doctorsSection?: ElementRef<HTMLElement>;


  // =====================================================
  // DOCTOR CARDS
  // =====================================================

  @ViewChildren('doctorCard')
  doctorCards!: QueryList<
    ElementRef<HTMLElement>
  >;


  // =====================================================
  // SCROLL ANIMATION
  // =====================================================

  private scrollListener?: () => void;

  private ticking = false;

  private readonly REVEAL_DISTANCE = 280;

  private readonly CARD_STAGGER = 0.1;

  private readonly ROW_STAGGER = 0.22;


  // =====================================================
  // DOCTORS
  // =====================================================

  doctors: Doctor[] = [];


  // =====================================================
  // FILTERS
  // =====================================================

  selectedDepartment =
    'All Departments';

  selectedAvailability =
    'all';

  selectedSort =
    'default';


  // =====================================================
  // PAGINATION
  // =====================================================

  /*
   * Initially only 8 doctors are displayed.
   *
   * After clicking "View All Doctors",
   * pagination becomes active.
   */

  showAllDoctors = false;

  currentPage = 1;

  readonly pageSize = 8;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    @Inject(PLATFORM_ID)
    private platformId: Object,

    private doctorService: DoctorService,

    private appointmentSelectionService:
      AppointmentSelectionService

  ) {}


  // =====================================================
  // AFTER VIEW INIT
  // =====================================================

  ngAfterViewInit(): void {

    this.loadDoctors();

  }


  // =====================================================
  // LOAD DOCTORS FROM BACKEND
  // =====================================================

  loadDoctors(): void {

    this.doctorService
      .getAllDoctors()
      .subscribe({

        next: (data) => {

          console.log(
            'Doctors loaded from backend:',
            data
          );

          this.doctors = data;


          // Make sure pagination starts
          // from the first page.

          this.currentPage = 1;


          // Refresh reveal animation
          // after doctors are rendered.

          if (
            isPlatformBrowser(
              this.platformId
            )
          ) {

            requestAnimationFrame(() => {

              this.setupDoctorReveal();

            });

          }

        },


        error: (error) => {

          console.error(
            'Failed to load doctors:',
            error
          );

        }

      });

  }


  // =====================================================
  // DYNAMIC DEPARTMENTS
  // =====================================================

  get departments(): string[] {

    /*
     * Get departments directly from
     * doctors returned by backend.
     *
     * Example:
     *
     * Cardiology
     * Neurology
     * Pediatrics
     * Orthopedics
     *
     * If a new department is added in
     * backend, it automatically appears.
     */

    const departments =
      this.doctors

        .map(
          doctor =>
            doctor.department
        )

        .filter(
          department =>
            department &&
            department.trim() !== ''
        );


    /*
     * Remove duplicate departments.
     */

    const uniqueDepartments =
      Array.from(
        new Set(departments)
      );


    return [
      'All Departments',
      ...uniqueDepartments
    ];

  }


  // =====================================================
  // FILTER + SORT DOCTORS
  // =====================================================

  get filteredDoctors(): Doctor[] {

    /*
     * Start with a copy of the
     * complete backend doctor list.
     */

    let result = [
      ...this.doctors
    ];


    // =================================================
    // DEPARTMENT FILTER
    // =================================================

    if (
      this.selectedDepartment !==
      'All Departments'
    ) {

      result =
        result.filter(
          doctor =>
            doctor.department ===
            this.selectedDepartment
        );

    }


    // =================================================
    // AVAILABILITY FILTER
    // =================================================

    if (
      this.selectedAvailability ===
      'on-duty'
    ) {

      result =
        result.filter(
          doctor =>
            doctor.available
        );

    }


    if (
      this.selectedAvailability ===
      'off-duty'
    ) {

      result =
        result.filter(
          doctor =>
            !doctor.available
        );

    }


    // =================================================
    // SORTING
    // =================================================

    switch (
      this.selectedSort
    ) {


      // -----------------------------------------------
      // DEFAULT
      // -----------------------------------------------

      case 'default':

        /*
         * Keep the order received
         * from the backend.
         */

        break;


      // -----------------------------------------------
      // TOP SPECIALISTS
      // -----------------------------------------------

      case 'top-specialists':

        /*
         * Primary:
         * Higher rating
         *
         * Secondary:
         * Higher patient count
         */

        result.sort(
          (a, b) => {

            if (
              b.rating !==
              a.rating
            ) {

              return (
                b.rating -
                a.rating
              );

            }


            return (
              b.patients -
              a.patients
            );

          }
        );

        break;


      // -----------------------------------------------
      // HIGHEST RATED
      // -----------------------------------------------

      case 'highest-rated':

        result.sort(
          (a, b) =>
            b.rating -
            a.rating
        );

        break;


      // -----------------------------------------------
      // MOST PATIENTS
      // -----------------------------------------------

      case 'most-patients':

        result.sort(
          (a, b) =>
            b.patients -
            a.patients
        );

        break;

    }


    return result;

  }


  // =====================================================
  // PAGINATED DOCTORS
  // =====================================================

  get paginatedDoctors(): Doctor[] {

    /*
     * BEFORE clicking "View All Doctors":
     *
     * Show only the first 8 doctors.
     */

    if (
      !this.showAllDoctors
    ) {

      return this.filteredDoctors.slice(
        0,
        this.pageSize
      );

    }


    /*
     * AFTER clicking "View All Doctors":
     *
     * Display 8 doctors according
     * to the selected page.
     */

    const startIndex =
      (
        this.currentPage - 1
      ) *
      this.pageSize;


    const endIndex =
      startIndex +
      this.pageSize;


    return this.filteredDoctors.slice(
      startIndex,
      endIndex
    );

  }


  // =====================================================
  // TOTAL PAGES
  // =====================================================

  get totalPages(): number {

    return Math.ceil(
      this.filteredDoctors.length /
      this.pageSize
    );

  }


  // =====================================================
  // PAGE NUMBERS
  // =====================================================

  get pageNumbers(): number[] {

    return Array.from(
      {
        length:
          this.totalPages
      },

      (_, index) =>
        index + 1

    );

  }


  // =====================================================
  // FILTER CHANGE
  // =====================================================

  onFilterChange(): void {

    /*
     * Whenever the user changes
     * a filter:
     *
     * 1. Return to page 1
     * 2. Refresh doctor animation
     */

    this.currentPage = 1;

    this.refreshDoctorReveal();

  }


  // =====================================================
  // GO TO PAGE
  // =====================================================

  goToPage(
    page: number
  ): void {

    /*
     * Prevent invalid page numbers.
     */

    if (
      page < 1 ||
      page > this.totalPages
    ) {

      return;

    }


    this.currentPage = page;


    this.refreshDoctorReveal();

  }


  // =====================================================
  // PREVIOUS PAGE
  // =====================================================

  previousPage(): void {

    if (
      this.currentPage <= 1
    ) {

      return;

    }


    this.currentPage--;

    this.refreshDoctorReveal();

  }


  // =====================================================
  // NEXT PAGE
  // =====================================================

  nextPage(): void {

    if (
      this.currentPage >=
      this.totalPages
    ) {

      return;

    }


    this.currentPage++;

    this.refreshDoctorReveal();

  }


  // =====================================================
  // REFRESH DOCTOR REVEAL
  // =====================================================

  private refreshDoctorReveal(): void {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {

      return;

    }


    /*
     * Angular needs a rendering cycle
     * to create the new filtered/page
     * doctor cards first.
     */

    requestAnimationFrame(() => {

      this.setupDoctorReveal();

    });

  }


  // =====================================================
  // BOOK APPOINTMENT
  // =====================================================

  bookAppointment(
    doctor: Doctor
  ): void {

    /*
     * Don't allow booking
     * unavailable doctors.
     */

    if (
      !doctor.available
    ) {

      return;

    }


    console.log(
      `Appointment requested with ${doctor.name}`
    );


    /*
     * Send selected doctor to
     * Appointment component.
     *
     * Appointment component will
     * receive this and open the
     * appointment popup.
     */

    this.appointmentSelectionService
      .selectDoctor({

        id: doctor.id,

        name: doctor.name,

        department:
          doctor.department

      });


    /*
     * IMPORTANT:
     *
     * There is intentionally NO:
     *
     * document.getElementById(...)
     *
     * scrollIntoView(...)
     *
     * here.
     *
     * The page should NOT scroll when
     * Book Appointment is clicked.
     */

  }


  // =====================================================
  // REMAP
  // =====================================================

  private remap(
    value: number,
    inMin: number,
    inMax: number
  ): number {

    const t =
      (
        value - inMin
      ) /
      (
        inMax - inMin
      );


    return Math.min(
      Math.max(t, 0),
      1
    );

  }


  // =====================================================
  // APPLY DOCTOR REVEAL
  // =====================================================

  private applyDoctorReveal(
    card: HTMLElement,
    progress: number
  ): void {

    const cardProgress =
      this.remap(
        progress,
        0,
        0.3
      );


    const imageProgress =
      this.remap(
        progress,
        0.0,
        0.55
      );


    const badgeProgress =
      this.remap(
        progress,
        0.3,
        0.6
      );


    const contentProgress =
      this.remap(
        progress,
        0.42,
        0.7
      );


    const socialProgress =
      this.remap(
        progress,
        0.55,
        0.78
      );


    const buttonProgress =
      this.remap(
        progress,
        0.7,
        1
      );


    card.style.setProperty(
      '--card-progress',
      `${cardProgress}`
    );


    card.style.setProperty(
      '--image-progress',
      `${imageProgress}`
    );


    card.style.setProperty(
      '--badge-progress',
      `${badgeProgress}`
    );


    card.style.setProperty(
      '--content-progress',
      `${contentProgress}`
    );


    card.style.setProperty(
      '--social-progress',
      `${socialProgress}`
    );


    card.style.setProperty(
      '--button-progress',
      `${buttonProgress}`
    );

  }


  // =====================================================
  // SETUP DOCTOR REVEAL
  // =====================================================

  private setupDoctorReveal(): void {

    /*
     * This component uses browser APIs,
     * so don't execute this during SSR.
     */

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {

      return;

    }


    // -----------------------------------------------
    // Remove previous listeners
    // -----------------------------------------------

    if (
      this.scrollListener
    ) {

      window.removeEventListener(
        'scroll',
        this.scrollListener
      );


      window.removeEventListener(
        'resize',
        this.scrollListener
      );

    }


    /*
     * IMPORTANT:
     *
     * Get the cards every time this
     * function runs.
     *
     * Filtering and pagination change
     * the *ngFor result.
     */

    const cards =
      this.doctorCards?.toArray() ?? [];


    if (
      !cards.length
    ) {

      return;

    }


    // -----------------------------------------------
    // Scroll listener
    // -----------------------------------------------

    this.scrollListener = () => {

      if (
        this.ticking
      ) {

        return;

      }


      this.ticking = true;


      requestAnimationFrame(() => {

        const viewportHeight =
          window.innerHeight;


        // -------------------------------------------
        // Determine columns
        // -------------------------------------------

        let columns = 3;


        if (
          window.innerWidth <=
          768
        ) {

          columns = 1;

        }

        else if (
          window.innerWidth <=
          1100
        ) {

          columns = 2;

        }


        // -------------------------------------------
        // Animate cards
        // -------------------------------------------

        cards.forEach(
          (
            ref,
            index
          ) => {

            const card =
              ref.nativeElement;


            const rect =
              card.getBoundingClientRect();


            const row =
              Math.floor(
                index / columns
              );


            const column =
              index % columns;


            const columnDelay =
              column *
              this.CARD_STAGGER;


            const rowDelay =
              row *
              this.ROW_STAGGER;


            const totalDelay =
              columnDelay +
              rowDelay;


            const delayPixels =
              totalDelay *
              this.REVEAL_DISTANCE;


            const revealLine =
              viewportHeight *
              0.95;


            const progress =
              this.remap(

                revealLine -
                rect.top -
                delayPixels,

                0,

                this.REVEAL_DISTANCE

              );


            this.applyDoctorReveal(
              card,
              progress
            );

          }
        );


        this.ticking = false;

      });

    };


    // -----------------------------------------------
    // Add listeners
    // -----------------------------------------------

    window.addEventListener(
      'scroll',
      this.scrollListener,
      {
        passive: true
      }
    );


    window.addEventListener(
      'resize',
      this.scrollListener,
      {
        passive: true
      }
    );


    // -----------------------------------------------
    // Initial animation calculation
    // -----------------------------------------------

    this.scrollListener();

  }


  // =====================================================
  // VIEW ALL DOCTORS
  // =====================================================

  viewAllDoctors(): void {

    /*
     * Don't reset filters here.
     *
     * If the user already selected:
     *
     * Cardiology
     * + On Duty
     * + Highest Rated
     *
     * those filters remain active.
     */

    this.showAllDoctors = true;

    this.currentPage = 1;

    this.refreshDoctorReveal();

  }


  // =====================================================
  // COMPONENT DESTROY
  // =====================================================

  ngOnDestroy(): void {

    if (
      this.scrollListener
    ) {

      window.removeEventListener(
        'scroll',
        this.scrollListener
      );


      window.removeEventListener(
        'resize',
        this.scrollListener
      );

    }

  }

}