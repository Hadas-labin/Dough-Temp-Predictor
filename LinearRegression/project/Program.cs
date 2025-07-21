using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Text.Json;
using project.ApiCommunication;
using static project.PredictionEnhancements;
using project;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowReact");//מפעיל אבטחה

app.MapPost("/send", async (HttpContext context) =>
{
    try
    {
        // קבלת הנתונים מהלקוח
        var data = await JsonSerializer.DeserializeAsync<TemperatureRequest>(context.Request.Body);
        double[] inputs = new double[] { data.oil, data.water, data.flour };



        var result = PredictionEnhancements.CheckAndSendFeature(inputs, 120);

        double iceAmount = result.IceAmount;
        double? oilAmount = result.OilAmount;

        var response = new PredictionResponse
        {
            IceAmount = iceAmount,
            OilAmount = oilAmount,
            ErrorMessage = ""
        };

        return Results.Ok(response);
    }
    catch (Exception ex)
    {
        Console.WriteLine("❌ שגיאה: " + ex.Message);

        return Results.Ok(new PredictionResponse
        {
            ErrorMessage = "אירעה שגיאה: " + ex.Message
        });
    }
});

app.Run();







//using OfficeOpenXml;
//using System;
//using System.IO;


//namespace project
//{
//    internal class Program
//    {
//        static void Main(string[] args)
//        {
//            try
//            {
//                DataLoader.LoadCsvData();
//                LinearRegression.PerformGradientDescent();

//                //✅ 1️⃣ Getting user input
//                Console.WriteLine("Enter the amount of flour:");
//                double flour = double.Parse(Console.ReadLine());

//                Console.WriteLine("Enter the amount of oil:");
//                double oil = double.Parse(Console.ReadLine());

//                Console.WriteLine("Enter the temperature of the water:");
//                double waterTemp = double.Parse(Console.ReadLine());

//                //Console.WriteLine("Enter the amount of ice (in grams):");
//                //double iceAmount = double.Parse(Console.ReadLine());
//                //iceAmount = iceAmount / 100.0;


//                // ✅ יצירת וקטור קלט עבור פונקציית הניבוי
//                double[] XTest = { flour, flour, oil, waterTemp ,0};
//                (double IceAmount, double? OilAmount) = PredictionEnhancements.CheckAndSendFeature(XTest, 120);

//                Console.WriteLine("IceAmount  =  " + IceAmount);
//                Console.WriteLine("OilAmount  =  " + OilAmount);

//                //for (int i = 0; i < XTest.Length; i++) { Console.WriteLine(" ," + XTest[i]); }

//                // ✅ חיזוי ובדיקת שגיאה
//                //(double YPred, double ErrorPercentage) = LinearRegression.PredictWithError(XTest, finalValue);

//                // ✅ 4️⃣ Displaying the results
//                // Console.WriteLine($"\n🔍 Predicted value: {YPred:F6}");
//                //Console.WriteLine($"📌 Error percentage: {ErrorPercentage:F2}%");
//            }
//            catch (Exception ex)
//            {
//                Console.WriteLine($"🔍 מקור השגיאה:\n{ex.StackTrace}:");
//                Console.WriteLine($"⚠ שגיאה קריטית בתוכנית: {ex.Message}");


//            }
//        }
//    }
//}