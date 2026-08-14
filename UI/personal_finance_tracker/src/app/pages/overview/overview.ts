import { Component, computed, effect, ElementRef, HostListener, signal, Signal, ViewChild } from '@angular/core';
import { getUser } from '../../stateManagement/selector/user.selector';
import { getExpenseList } from '../../stateManagement/selector/expense.selector'; 
import { StatisticBlock } from '../../components/statistics/statistic-block/statistic-block';
import { StatisticDataBuilder } from '../../logics/statistic-data.builder';
import { ExpenseService } from '../../service/expense.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideFunnel, LucideImageUpscale } from '@lucide/angular';
import { SlideUpForm } from '../../components/slide-up-form/slide-up-form';
import { ToasterService } from '../../service/toaster.service';
import { WidgetBlock } from '../../components/widgets/widget-block/widget-block';
import { statWidgetDataFilterService } from '../../logics/statWidgetDataFilter.logic';
import { WidgetGrid } from '../../components/widgets/widget-grid/widget-grid';
import { NgGridStackWidget } from 'gridstack/dist/angular';
import { widgetCardsConfig } from '../../helper/vizInsight.config';
import { VizInsightsService } from '../../logics/vizInsights.logic';


interface MonthOption {
  value: Months;       // e.g., "2026-05" (Useful for backend filtering)
  displayName: string; // e.g., "May 2026"
}

@Component({
  selector: 'app-overview',
  imports: [StatisticBlock, FormsModule, ReactiveFormsModule, LucideFunnel, LucideImageUpscale, SlideUpForm, WidgetBlock, WidgetGrid],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
})
export class Overview {

  @ViewChild('section3Container') section3Container!: ElementRef<HTMLDivElement>;


  public enable_drag_resize = signal<boolean>(false);

  // NEW PANEL MANAGEMENT STATE SIGNALS
  public isPanelExpanded = signal<boolean>(false);
  private currentYOffset = signal<number>(0); // Dynamic dragging pixels value
  
  // Computes the instantaneous position transition injection 
  public panelTransform = computed(() => {
    if (this.isPanelExpanded()) {
      return `translateY(0px)`; // Locked securely at full screen top view boundary
    }
    // Default desktop/mobile natural idle layout placement calculation
    // Adjusted automatically dynamically during a user active drag
    const offset = this.currentYOffset();
    return offset !== 0 ? `translateY(${offset}px)` : this.width() < 768 ? `translateY(69%)` : this.width() < 1024 ? `translateY(35%)` : `translateY(80%)`;
  });

  // Touch gesture coordinates tracking
  private touchStartY = 0;
  private isDragging = false;

    // Decorator catches window resize events natively without requiring Zone.js
  width = signal(typeof window !== 'undefined' ? window.innerWidth : 0);
  @HostListener('window:resize')
  onResize() {
    this.width.set(window.innerWidth);
  }

  public user_detail: Signal<UserState> = getUser();
  private expensesList: Signal<ExpenseSchema[]> = getExpenseList();
  public quickInsightDetails: Signal<{statisticDetail:StatisticDetail[], widgetDetails: Omit<WidgetDetails, 'widgetId'>[]}>;
  public insightRawData: Signal<{widgetId:string, rawData:any[]}[]>;
  public readonly statisticsLoader: Signal<boolean>;
  public monthOptions = signal<MonthOption[]>([]);
   monthControl = new FormControl('');
   public selectedMonth = signal<Months>('jan');
   public overviewFilterForm!:FormGroup;
   public openFilterForm = signal<boolean>(false);
   public customMonthRangeDisplay = signal<string>('');

   private widgetCardsConfig = signal<VizWidgetBaseConfig[]>(widgetCardsConfig);
   public widgetCardDataConfig = signal<WidgetDetails[]>([]);


  private activeFilter = signal<{ month: Months | null; expenses: ExpenseSchema[] | null }>({
    month: 'jan', 
    expenses: null
  });

  constructor(private statisticsDataBuilder: StatisticDataBuilder, private expenseService: ExpenseService,
    private _fb:FormBuilder, private toasterService: ToasterService, private statWidgetService:statWidgetDataFilterService,
    private vizInsightDataService:VizInsightsService
  ) {
     
    effect(() => {
      this.generateMonthDropdown();
      this.generateOverviewFilterForm();
    });

    effect(()=>{
      const widgetCardsConfig = this.widgetCardsConfig();
      this.widgetCardDataConfig.set(
        this.vizInsightDataService.generate_vizInsightWidget_baseConfig(widgetCardsConfig)
      );
    });

  
    
    this.statisticsLoader = this.expenseService.getExpenseLoader;

    //------ previous fine working logic ---------
    // this.quickInsightDetails = computed(() => {
    //   const expenses = this.expensesList(); 

    //   const selectedMonth = this.selectedMonth();
    //   this.updateOverviewMonthFilter(selectedMonth);
      
    //   if (!expenses || expenses.length === 0) return [];

    //   return [
    //     this.statisticsDataBuilder.getTotalOutFlow(selectedMonth),
    //     this.statisticsDataBuilder.getTotalInFlow(selectedMonth),
    //     this.statisticsDataBuilder.getTotalCashFlow(selectedMonth),
    //     this.statisticsDataBuilder.getMostSpentCategory(selectedMonth),
    //   ];
    // });

    //-------  latest new requirement changed logic  -----------
     this.quickInsightDetails = computed(() => {

      const { month, expenses } = this.activeFilter();
      const currentExpensesList = expenses ?? this.expensesList();

      if(month) this.updateOverviewMonthFilter(month);
    
      if (!currentExpensesList || currentExpensesList.length === 0) return {statisticDetail: [], widgetDetails: []};
      return {
        statisticDetail: 
       [
        this.statisticsDataBuilder.getTotalOutFlow(month, currentExpensesList),
        this.statisticsDataBuilder.getTotalInFlow(month, currentExpensesList),
        this.statisticsDataBuilder.getTotalCashFlow(month, currentExpensesList),
        this.statisticsDataBuilder.getMostSpentCategory(month, currentExpensesList),
      ],
      widgetDetails: [
       this.statWidgetService.getExpense_WidgetDataByMonth(month, 'DEBITED', currentExpensesList),
       this.statWidgetService.getExpense_WidgetDataByMonth(month, 'CREDITED', currentExpensesList),
      ] 
    }
    });
    

    this.insightRawData = computed(() => {
       const { month, expenses } = this.activeFilter();
      const currentExpensesList = expenses ?? this.expensesList();
      const requiredRawData = month ? this.vizInsightDataService.getMonthly_insightData(month, currentExpensesList) : currentExpensesList;
      return this.widgetCardDataConfig().map(widget => this.vizInsightDataService.generate_insightWidget_rawData(widget.widgetId, requiredRawData));
    });

         
        }


private generateMonthDropdown() {
  const options: MonthOption[] = [];

  const availableMonths = this.getAvailableMonths();

  availableMonths.forEach(({ year, sortMonth }) => {
    options.push({
      value: `${sortMonth as Months}`,
      displayName: `${sortMonth.charAt(0).toUpperCase() + sortMonth.slice(1)} ${year}`
    });
   });

  // Set the signal value
  this.monthOptions.set(options);
  
  // Pre-select the current month (which is now index 0)
  if (options.length > 0) {
    this.monthControl.setValue(options[0].value);

    this.activeFilter.set({month:options[0].value, expenses: null})
    
    this.monthControl.valueChanges.subscribe((value: any) => {
      this.customMonthRangeDisplay.set(''); // Clear custom range when predefined month is selected
      this.activeFilter.set({month:value, expenses: null})
    });
  }
}


private getAvailableMonths(){

  const monthKeys = Object.keys(this.statisticsDataBuilder.expenseInsights());
  if(monthKeys.length > 0){
    return monthKeys
    .sort((a, b) => b.localeCompare(a))
    .map(key => {
      const [year, month] = key.split('-');
     const dummyDate = new Date(Number(year), Number(month), 1);
     const sortMonth = dummyDate.toLocaleString('default', { month: 'short' }).toLowerCase();
      return { year, sortMonth };
    })
  }

  return [];
}

private generateOverviewFilterForm(){
  this.overviewFilterForm = this._fb.group({
    month: this._fb.group({
      from: [],
      to: []
    }),
    searchKey:[''],
    paymentMode: ['ALL'],
    filteredExpenses: [[]]

  });
}

private updateOverviewMonthFilter(month: Months){
     const year = this.monthOptions().find(option => option.value === month)?.displayName.split(' ')[1];
     // 1. Map string to 0-indexed month number
      const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const monthIndex = months.indexOf(month.toLowerCase());

      // 2. Get the first day of the month
      const firstDate = new Date(Date.UTC(Number(year), monthIndex, 1));
      // 3. Get the last day of the month (passing 0 to the next month's day parameter)
      const lastDate = new Date(Date.UTC(Number(year), monthIndex + 1, 0));

      if(firstDate.toString() === 'Invalid Date' || lastDate.toString() === 'Invalid Date') return ;
      this.overviewFilterForm.patchValue({
        month: {
          from: firstDate?.toISOString().substring(0, 10),
          to: lastDate.toISOString().substring(0, 10)
        }
      });
      
}


public openOverviewFilter(){
  this.openFilterForm.set(true);
}

public get_insights(event:any ){

  const incomingExpenses = event.filteredExpenses.filter((d: FilterableExpenseSchema) => !d.isRemoved);

  // If month data is provided, display the month range in the text box
  if (event.month && event.month.from && event.month.to) {
    const fromDate = new Date(event.month.from);
    const toDate = new Date(event.month.to);
    
    const fromMonth = fromDate.toLocaleString('default', { month: 'short' });
    const toMonth = toDate.toLocaleString('default', { month: 'short' });
    
    const monthRangeDisplay = fromMonth === toMonth ? fromMonth : `${fromMonth} - ${toMonth}`;
    
    this.customMonthRangeDisplay.set(monthRangeDisplay);
  }

  this.activeFilter.set({
    month: null,
    expenses: incomingExpenses
  });

  this.openFilterForm.set(false);
}





  // ==========================================
  // MOBILE GESTURE & TOUCH EVENTS OVERLAYS
  // ==========================================
  public onTouchStart(event: TouchEvent): void {
    if (!event.touches || event.touches.length === 0) return;


    this.touchStartY = event.touches[0].clientY;
    this.isDragging = true;
  }

  public onTouchMove(event: TouchEvent): void {
    if (!this.isDragging || !event.touches || event.touches.length === 0) return;

    const currentY = event.touches[0].clientY;
    const deltaY = currentY - this.touchStartY; // Positive means pulling finger down

    // Case 1: Panel is closed -> Swiping finger UP -> Pull panel open
    if (!this.isPanelExpanded() && deltaY < -20) {
      event.preventDefault(); 
      this.currentYOffset.set(this.getInitialCollapsedPixels() + deltaY);
    }
    
    // Case 2: Panel is open -> Swiping finger DOWN -> ONLY close if touch started at scrollTop = 0
    else if (this.isPanelExpanded() && deltaY > 0 ) {
      event.preventDefault();
      this.currentYOffset.set(deltaY);
    } 
    
    // Case 3: If user is actively scrolling content, do not let panel shift position
    else if (this.isPanelExpanded() ) {
      this.currentYOffset.set(0);
    }
  }

  public onTouchEnd(event: TouchEvent): void {
    if (!this.isDragging) return;
    this.isDragging = false;

    if (!event.changedTouches || event.changedTouches.length === 0) return;

    const endY = event.changedTouches[0].clientY;
    const totalSwipeDistance = endY - this.touchStartY;

    if (!this.isPanelExpanded() && totalSwipeDistance < -80) {
      this.snapToTop();
    } 
    // Only drop down if threshold passes, scroll is 0, AND touch sequence started at the top boundary
    else if (this.isPanelExpanded() && totalSwipeDistance > 50 ) {
      this.snapToBottom();
    } 
    else {
      this.isPanelExpanded() ? this.snapToTop() : this.snapToBottom();
    }
  }

  // ==========================================
  // DESKTOP INTERACTION WHEEL SCROLL LOGIC
  // ==========================================
  public onDesktopWheel(event: WheelEvent): void {

    // Wheel Scroll Down -> Open panel if closed
    if (!this.isPanelExpanded() && event.deltaY > 0) {
      event.preventDefault();
      this.snapToTop();
    }
    
    // Wheel Scroll Up -> ONLY drop panel if content is already resting at 0 BEFORE this wheel tick
    else if (this.isPanelExpanded() && event.deltaY < 0) {
        event.preventDefault();
        this.snapToBottom();
    }
  }



  // Helper calculation layout state triggers
  private snapToTop(): void {
    this.isPanelExpanded.set(true);
    this.currentYOffset.set(0);
    if (this.section3Container) {
      requestAnimationFrame(() => {
        window.scrollBy({
          top: 70,
          behavior: 'smooth'
        });
      });
      this.section3Container.nativeElement.style.overflowY = 'auto'; // Unlock internal scroll
    }
  }

  private snapToBottom(): void {
    this.isPanelExpanded.set(false);
    this.currentYOffset.set(0);
    if (this.section3Container) {
      this.section3Container.nativeElement.scrollTop = 0; // Reset scroll target edge position
      this.section3Container.nativeElement.style.overflowY = 'hidden'; // Lock internal scroll
    }
  }

  private getInitialCollapsedPixels(): number {
    // Helper estimation mapper matching fallback CSS translate percentage values 
    return window.innerHeight * 0.65;
  }

  public layoutUpdate(event:NgGridStackWidget[]){
    console.log(event);
    
  }

}





















// {
//    // 1. References to the HTML elements
//   barContainer = viewChild<ElementRef>('barContainer');
//   pieContainer = viewChild<ElementRef>('pieContainer');
  
//   // 2. Chart Instances
//   private barChart?: echarts.ECharts;
//   private pieChart?: echarts.ECharts;

//   // 3. Input Data (The 40 objects generated previously)
//   expenses = input<any[]>([
//   {
//     "expenseName": "Grocery Shopping",
//     "expenseCategory": "Food & Dining",
//     "amount": 3282,
//     "paymentMode": "UPI",
//     "mode": "DEBITED",
//     "notes": "Weekly vegetables and fruits",
//     "currency": "INR",
//     "customGrouping": "November-2025-Food"
//   },
//   {
//     "expenseName": "Netflix Subscription",
//     "expenseCategory": "Entertainment",
//     "amount": 499,
//     "paymentMode": "CREDIT CARD",
//     "mode": "DEBITED",
//     "notes": "Monthly premium plan",
//     "currency": "INR",
//     "customGrouping": "November-2025-Entertainment"
//   },
//   {
//     "expenseName": "Gym Membership",
//     "expenseCategory": "Health",
//     "amount": 1500,
//     "paymentMode": "CASH",
//     "mode": "DEBITED",
//     "notes": "Monthly gym fee",
//     "currency": "INR",
//     "customGrouping": "November-2025-Health"
//   },
//   {
//     "expenseName": "Internet Bill",
//     "expenseCategory": "Utilities",
//     "amount": 999,
//     "paymentMode": "BANK_TRANSFER",
//     "mode": "DEBITED",
//     "notes": "Fiber broadband",
//     "currency": "INR",
//     "customGrouping": "December-2025-Utilities"
//   },
//   {
//     "expenseName": "Office Lunch",
//     "expenseCategory": "Food & Dining",
//     "amount": 450,
//     "paymentMode": "WALLET",
//     "mode": "DEBITED",
//     "notes": "Team lunch",
//     "currency": "INR",
//     "customGrouping": "November-2025-Food"
//   },
//   {
//     "expenseName": "Home Rent",
//     "expenseCategory": "Rent",
//     "amount": 25000,
//     "paymentMode": "CHEQUE",
//     "mode": "DEBITED",
//     "notes": "December rent",
//     "currency": "INR",
//     "customGrouping": "December-2025-Rent"
//   },
//   {
//     "expenseName": "Uber Ride",
//     "expenseCategory": "Transport",
//     "amount": 350,
//     "paymentMode": "UPI",
//     "mode": "DEBITED",
//     "notes": "Commute to office",
//     "currency": "INR",
//     "customGrouping": "November-2025-Transport"
//   },
//   {
//     "expenseName": "Zomato Order",
//     "expenseCategory": "Food & Dining",
//     "amount": 650,
//     "paymentMode": "CREDIT CARD",
//     "mode": "DEBITED",
//     "notes": "Dinner order",
//     "currency": "INR",
//     "customGrouping": "November-2025-Food"
//   },
//   {
//     "expenseName": "Pharmacy",
//     "expenseCategory": "Health",
//     "amount": 1200,
//     "paymentMode": "CASH",
//     "mode": "DEBITED",
//     "notes": "Regular medications",
//     "currency": "INR",
//     "customGrouping": "December-2025-Health"
//   },
//   {
//     "expenseName": "Mobile Recharge",
//     "expenseCategory": "Utilities",
//     "amount": 799,
//     "paymentMode": "WALLET",
//     "mode": "DEBITED",
//     "notes": "Prepaid plan",
//     "currency": "INR",
//     "customGrouping": "November-2025-Utilities"
//   },
//   {
//     "expenseName": "Electricity Bill",
//     "expenseCategory": "Utilities",
//     "amount": 2800,
//     "paymentMode": "BANK_TRANSFER",
//     "mode": "DEBITED",
//     "notes": "Monthly power bill",
//     "currency": "INR",
//     "customGrouping": "December-2025-Utilities"
//   },
//   {
//     "expenseName": "New Shoes",
//     "expenseCategory": "Shopping",
//     "amount": 4500,
//     "paymentMode": "DEBIT CARD",
//     "mode": "DEBITED",
//     "notes": "Running shoes",
//     "currency": "INR",
//     "customGrouping": "November-2025-Shopping"
//   },
//   {
//     "expenseName": "Movie Tickets",
//     "expenseCategory": "Entertainment",
//     "amount": 800,
//     "paymentMode": "UPI",
//     "mode": "DEBITED",
//     "notes": "Weekend movie",
//     "currency": "INR",
//     "customGrouping": "December-2025-Entertainment"
//   },
//   {
//     "expenseName": "Freelance Payment",
//     "expenseCategory": "Income",
//     "amount": 15000,
//     "paymentMode": "BANK_TRANSFER",
//     "mode": "CREDITED",
//     "notes": "Website design project",
//     "currency": "INR",
//     "customGrouping": "November-2025-Income"
//   },
//   {
//     "expenseName": "Coffee",
//     "expenseCategory": "Food & Dining",
//     "amount": 250,
//     "paymentMode": "CASH",
//     "mode": "DEBITED",
//     "notes": "Starbucks visit",
//     "currency": "INR",
//     "customGrouping": "December-2025-Food"
//   },
//   {
//     "expenseName": "Gas Cylinder",
//     "expenseCategory": "Utilities",
//     "amount": 1100,
//     "paymentMode": "UPI",
//     "mode": "DEBITED",
//     "notes": "LPG refill",
//     "currency": "INR",
//     "customGrouping": "November-2025-Utilities"
//   },
//   {
//     "expenseName": "Car Service",
//     "expenseCategory": "Transport",
//     "amount": 8500,
//     "paymentMode": "CREDIT CARD",
//     "mode": "DEBITED",
//     "notes": "Annual maintenance",
//     "currency": "INR",
//     "customGrouping": "December-2025-Transport"
//   },
//   {
//     "expenseName": "Gift for Friend",
//     "expenseCategory": "Gifts",
//     "amount": 2000,
//     "paymentMode": "WALLET",
//     "mode": "DEBITED",
//     "notes": "Birthday gift",
//     "currency": "INR",
//     "customGrouping": "November-2025-Gifts"
//   },
//   {
//     "expenseName": "Amazon Prime",
//     "expenseCategory": "Entertainment",
//     "amount": 1499,
//     "paymentMode": "CREDIT CARD",
//     "mode": "DEBITED",
//     "notes": "Annual membership",
//     "currency": "INR",
//     "customGrouping": "December-2025-Entertainment"
//   },
//   {
//     "expenseName": "Milk Delivery",
//     "expenseCategory": "Food & Dining",
//     "amount": 1800,
//     "paymentMode": "CASH",
//     "mode": "DEBITED",
//     "notes": "Monthly milk bill",
//     "currency": "INR",
//     "customGrouping": "November-2025-Food"
//   },
//   {
//     "expenseName": "Flight Ticket",
//     "expenseCategory": "Transport",
//     "amount": 12000,
//     "paymentMode": "BANK_TRANSFER",
//     "mode": "DEBITED",
//     "notes": "Holiday trip",
//     "currency": "INR",
//     "customGrouping": "December-2025-Transport"
//   },
//   {
//     "expenseName": "House Help Salary",
//     "expenseCategory": "Rent",
//     "amount": 6000,
//     "paymentMode": "CASH",
//     "mode": "DEBITED",
//     "notes": "Monthly salary",
//     "currency": "INR",
//     "customGrouping": "November-2025-Rent"
//   },
//   {
//     "expenseName": "Stationery",
//     "expenseCategory": "Education",
//     "amount": 400,
//     "paymentMode": "UPI",
//     "mode": "DEBITED",
//     "notes": "Office supplies",
//     "currency": "INR",
//     "customGrouping": "December-2025-Education"
//   },
//   {
//     "expenseName": "Tuition Fee",
//     "expenseCategory": "Education",
//     "amount": 5000,
//     "paymentMode": "CHEQUE",
//     "mode": "DEBITED",
//     "notes": "Quarterly fees",
//     "currency": "INR",
//     "customGrouping": "November-2025-Education"
//   },
//   {
//     "expenseName": "New T-shirt",
//     "expenseCategory": "Shopping",
//     "amount": 1200,
//     "paymentMode": "WALLET",
//     "mode": "DEBITED",
//     "notes": "Myntra sale",
//     "currency": "INR",
//     "customGrouping": "December-2025-Shopping"
//   },
//   {
//     "expenseName": "Fruit Purchase",
//     "expenseCategory": "Food & Dining",
//     "amount": 300,
//     "paymentMode": "CASH",
//     "mode": "DEBITED",
//     "notes": "Street vendor",
//     "currency": "INR",
//     "customGrouping": "November-2025-Food"
//   },
//   {
//     "expenseName": "Hospital Bill",
//     "expenseCategory": "Health",
//     "amount": 15000,
//     "paymentMode": "DEBIT CARD",
//     "mode": "DEBITED",
//     "notes": "Minor surgery",
//     "currency": "INR",
//     "customGrouping": "December-2025-Health"
//   },
//   {
//     "expenseName": "Book Purchase",
//     "expenseCategory": "Education",
//     "amount": 750,
//     "paymentMode": "UPI",
//     "mode": "DEBITED",
//     "notes": "Programming book",
//     "currency": "INR",
//     "customGrouping": "November-2025-Education"
//   },
//   {
//     "expenseName": "Restaurant Dinner",
//     "expenseCategory": "Food & Dining",
//     "amount": 3500,
//     "paymentMode": "CREDIT CARD",
//     "mode": "DEBITED",
//     "notes": "Family dinner",
//     "currency": "INR",
//     "customGrouping": "December-2025-Food"
//   },
//   {
//     "expenseName": "Bus Ticket",
//     "expenseCategory": "Transport",
//     "amount": 150,
//     "paymentMode": "CASH",
//     "mode": "DEBITED",
//     "notes": "Local travel",
//     "currency": "INR",
//     "customGrouping": "November-2025-Transport"
//   },
//   {
//     "expenseName": "Video Game",
//     "expenseCategory": "Entertainment",
//     "amount": 3999,
//     "paymentMode": "WALLET",
//     "mode": "DEBITED",
//     "notes": "Steam purchase",
//     "currency": "INR",
//     "customGrouping": "December-2025-Entertainment"
//   },
//   {
//     "expenseName": "Society Maintenance",
//     "expenseCategory": "Rent",
//     "amount": 4500,
//     "paymentMode": "BANK_TRANSFER",
//     "mode": "DEBITED",
//     "notes": "Quarterly maintenance",
//     "currency": "INR",
//     "customGrouping": "November-2025-Rent"
//   },
//   {
//     "expenseName": "Yoga Class",
//     "expenseCategory": "Health",
//     "amount": 2500,
//     "paymentMode": "UPI",
//     "mode": "DEBITED",
//     "notes": "Monthly fee",
//     "currency": "INR",
//     "customGrouping": "December-2025-Health"
//   },
//   {
//     "expenseName": "Pet Food",
//     "expenseCategory": "Shopping",
//     "amount": 3200,
//     "paymentMode": "CREDIT CARD",
//     "mode": "DEBITED",
//     "notes": "Dog food refill",
//     "currency": "INR",
//     "customGrouping": "November-2025-Shopping"
//   },
//   {
//     "expenseName": "Charity Donation",
//     "expenseCategory": "Gifts",
//     "amount": 1000,
//     "paymentMode": "UPI",
//     "mode": "DEBITED",
//     "notes": "NGO donation",
//     "currency": "INR",
//     "customGrouping": "December-2025-Gifts"
//   },
//   {
//     "expenseName": "Laundry Bill",
//     "expenseCategory": "Utilities",
//     "amount": 600,
//     "paymentMode": "CASH",
//     "mode": "DEBITED",
//     "notes": "Dry cleaning",
//     "currency": "INR",
//     "customGrouping": "November-2025-Utilities"
//   },
//   {
//     "expenseName": "Water Bill",
//     "expenseCategory": "Utilities",
//     "amount": 450,
//     "paymentMode": "UPI",
//     "mode": "DEBITED",
//     "notes": "Monthly water usage",
//     "currency": "INR",
//     "customGrouping": "December-2025-Utilities"
//   },
//   {
//     "expenseName": "Keyboard",
//     "expenseCategory": "Shopping",
//     "amount": 2200,
//     "paymentMode": "DEBIT CARD",
//     "mode": "DEBITED",
//     "notes": "Mechanical keyboard",
//     "currency": "INR",
//     "customGrouping": "November-2025-Shopping"
//   },
//   {
//     "expenseName": "Parking Fee",
//     "expenseCategory": "Transport",
//     "amount": 100,
//     "paymentMode": "CASH",
//     "mode": "DEBITED",
//     "notes": "Mall parking",
//     "currency": "INR",
//     "customGrouping": "December-2025-Transport"
//   },
//   {
//     "expenseName": "Laptop Repair",
//     "expenseCategory": "Education",
//     "amount": 4500,
//     "paymentMode": "UPI",
//     "mode": "DEBITED",
//     "notes": "Screen replacement",
//     "currency": "INR",
//     "customGrouping": "November-2025-Education"
//   }
// ]
// );

//   constructor() {
//     // 4. Update charts whenever data changes
//     effect(() => {
//   const data = this.expenses();
//   // Only update if the charts are actually initialized
//   if (this.barChart && this.pieChart) {
//     this.updateCharts(data);
//   }
// });
//   }

// ngAfterViewInit() {
//     echarts.registerTransform(aggregate as any);
//   this.barChart = echarts.init(this.barContainer()?.nativeElement);
//   this.pieChart = echarts.init(this.pieContainer()?.nativeElement);
  
//   // Manually trigger the first render once containers are ready
//   this.updateCharts(this.expenses());
  
//   window.addEventListener('resize', this.onResize);
// }

//   updateCharts(data: any[]) {
//     if (!this.barChart || !this.pieChart) return;

//     // 6. SHARED DATASET: Use the same array for both
//     const dataset = { source: data };

//     // --- FORM 1: BAR CHART ---
//    this.barChart.setOption({
//   dataset: [
//     { 
//       source: data,
//        sourceHeader: false,
//       dimensions: ['expenseName', 'expenseCategory', 'amount', 'paymentMode', 'mode', 'notes', 'currency', 'customGrouping']
//      },
//     {
//       transform: [
//         {
//           type: 'ecSimpleTransform:aggregate',
//           config: {
//              fromDatasetIndex: 0,
//             groupBy: 'expenseCategory',
//             resultDimensions: [
//               { from: 'expenseCategory', name: 'expenseCategory' },
//               { from: 'amount', method: 'sum', name: 'totalAmount' }
//             ]
//           }
//         }
//       ]
//     }
//   ],
//   tooltip: { trigger: 'axis' },
//   xAxis: { 
//     type: 'category', 
//     axisLabel: { 
//       interval: 0,
//       rotate: 30
//     } 
//   },
//   yAxis: {},
//   series: [{
//     type: 'bar',
//     datasetIndex: 1,
//     encode: { x: 'expenseCategory', y: 'totalAmount' }
//   }]
// });

//     // --- FORM 2: PIE CHART ---
//     this.pieChart.setOption({
//       dataset: dataset,
//       tooltip: { trigger: 'item' },
//       series: [{
//         type: 'pie',
//         radius: '50%',
//         encode: { itemName: 'expenseName', value: 'amount' }
//       }]
//     });

//     console.log(this.barChart.getOption());
//   }

//   onResize = () => {
//     this.barChart?.resize();
//     this.pieChart?.resize();
//   }

//   ngOnDestroy() {
//     // 7. DISPOSE: Release resources to avoid memory leaks
//     window.removeEventListener('resize', this.onResize);
//     this.barChart?.dispose();
//     this.pieChart?.dispose();
//   }
// }


