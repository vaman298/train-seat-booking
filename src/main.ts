import { CommonModule } from '@angular/common'; // Import CommonModule
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add CommonModule and FormsModule
  template: `
    <div>
      <h1>Train Seat Booking System</h1>
      <div style="text-align: center; margin-top: 20px;">
        <label for="seatCount">Enter number of seats to book (1-7): </label>
        <input
          type="number"
          id="seatCount"
          [(ngModel)]="seatsRequested"
          placeholder="Enter number of seats (1-7)"
          min="1"
          max="7"
        />
        <button (click)="bookSeats()">Book Seats</button>
      </div>
      <div class="seating">
        <div *ngFor="let row of getRows()" class="row">
          <div
            *ngFor="let seat of getSeatsInRow(row)"
            class="seat"
            [ngClass]="{ booked: seat.isBooked }"
          >
            {{ seat.seatNumber }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .seating {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
      }
      .row {
        display: flex;
        margin-bottom: 5px;
      }
      .seat {
        width: 40px;
        height: 40px;
        margin-right: 5px;
        background-color: lightgreen;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
        border: 1px solid #ddd;
        border-radius: 5px;
      }
      .seat.booked {
        background-color: lightcoral;
      }
    `,
  ],
})
export class AppComponent {
  seats: { seatNumber: number; rowNumber: number; isBooked: boolean }[] = [];
  seatsRequested: number = 0;

  constructor() {
    this.initializeSeats();
  }

  initializeSeats() {
    let seatNumber = 1;
    for (let row = 1; row <= 12; row++) {
      let seatsInRow = row === 12 ? 3 : 7; // Last row has 3 seats
      for (let s = 1; s <= seatsInRow; s++) {
        this.seats.push({
          seatNumber: seatNumber++,
          rowNumber: row,
          isBooked: false,
        });
      }
    }
  }

  bookSeats() {
    if (this.seatsRequested < 1 || this.seatsRequested > 7) {
      alert('Please enter a number between 1 and 7.');
      return;
    }

    let seatsToBook: { seatNumber: number; rowNumber: number; isBooked: boolean }[] = [];

    // Step 1: Try to find enough seats in a single row
    for (let row = 1; row <= 12; row++) {
      let availableSeatsInRow = this.seats.filter(
        (seat) => seat.rowNumber === row && !seat.isBooked
      );
      if (availableSeatsInRow.length >= this.seatsRequested) {
        seatsToBook = availableSeatsInRow.slice(0, this.seatsRequested);
        break;
      }
    }

    // Step 2: If not enough seats in one row, find the next available seats
    if (seatsToBook.length === 0) {
      seatsToBook = this.seats
        .filter((seat) => !seat.isBooked)
        .slice(0, this.seatsRequested);
    }

    // Step 3: Book the seats
    if (seatsToBook.length === this.seatsRequested) {
      seatsToBook.forEach((seat) => (seat.isBooked = true));
      alert(
        `Successfully booked seats: ${seatsToBook
          .map((seat) => seat.seatNumber)
          .join(', ')}`
      );
    } else {
      alert('Not enough seats available.');
    }
  }

  getRows() {
    return Array.from(new Set(this.seats.map((seat) => seat.rowNumber)));
  }

  getSeatsInRow(rowNumber: number) {
    return this.seats.filter((seat) => seat.rowNumber === rowNumber);
  }
}

bootstrapApplication(AppComponent);
