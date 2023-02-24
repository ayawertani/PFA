import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RouterModule } from "@angular/router";
import { allAppRoutes } from "./routes";
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChatbotComponent } from './chatbot/chatbot.component';
@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(allAppRoutes),
        ReactiveFormsModule,
        HttpClientModule
    ],
    declarations: [
      ChatbotComponent
    ]
    
})
export class AppModule {}

