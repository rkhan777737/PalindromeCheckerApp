/**
 * UC13: Performance Comparison
 * Goal: Compare the performance of different palindrome approaches.
 */
public class PalindromeCheckerApp {
    public static void main(String[] args) {
        String input = "level";

        // 1. Performance of Character Array (UC4)
        long startUC4 = System.nanoTime();
        checkUC4(input);
        long endUC4 = System.nanoTime();
        displayResult("UC4 (Char Array)", input, (endUC4 - startUC4));

        // 2. Performance of Stack-Based (UC5)
        long startUC5 = System.nanoTime();
        checkUC5(input);
        long endUC5 = System.nanoTime();
        displayResult("UC5 (Stack)", input, (endUC5 - startUC5));
    }

    private static void displayResult(String method, String input, long duration) {
        System.out.println("Method: " + method);
        System.out.println("Input : " + input);
        System.out.println("Execution Time : " + duration + " ns");
        System.out.println("-----------------------------------");
    }

    // internal implementation for UC4
    private static boolean checkUC4(String s) {
        char[] chars = s.toCharArray();
        int start = 0, end = chars.length - 1;
        while (start < end) {
            if (chars[start++] != chars[end--]) return false;
        }
        return true;
    }

    // internal implementation for UC5
    private static boolean checkUC5(String s) {
        java.util.Stack<Character> stack = new java.util.Stack<>();
        for (char c : s.toCharArray()) stack.push(c);
        for (char c : s.toCharArray()) {
            if (c != stack.pop()) return false;
        }
        return true;
    }
}