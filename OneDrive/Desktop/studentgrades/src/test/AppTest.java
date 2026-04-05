package com.mycompany.app;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

public class AppTest {

    @Test
    void testGradeA() {
        assertEquals("A", App.calculateGrade(95));
    }

    @Test
    void testGradeB() {
        assertEquals("B", App.calculateGrade(80));
    }

    @Test
    void testFail() {
        assertEquals("Fail", App.calculateGrade(30));
    }
}