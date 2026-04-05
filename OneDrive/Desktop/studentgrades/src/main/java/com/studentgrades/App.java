package com.mycompany.app;

public class App {

    public static String calculateGrade(int marks) {
        if (marks >= 90) return "A";
        else if (marks >= 75) return "B";
        else if (marks >= 50) return "C";
        else return "Fail";
    }

    public static void main(String[] args) {
        int marks = 82;
        String grade = calculateGrade(marks);
        System.out.println("Marks: " + marks);
        System.out.println("Grade: " + grade);
    }
}