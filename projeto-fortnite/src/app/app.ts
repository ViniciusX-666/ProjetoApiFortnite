import { Component } from '@angular/core';
import { Footer } from "./components/footer/footer";
import { RouterOutlet } from "@angular/router";
import { Navbar } from "./components/navbar/navbar";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Footer, RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected title = 'projeto-fortnite';
}
