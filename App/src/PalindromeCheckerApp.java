import java.util.*;

/**
 * UC12: Strategy Pattern Implementation
 * Goal: Choose a palindrome algorithm dynamically.
 */

// Define the PalindromeStrategy interface
interface PalindromeStrategy {
    boolean check(String input);
}

/**
 * Stack-based implementation of the strategy.
 * Uses LIFO behavior to reverse characters for comparison.
 */
class StackStrategy implements PalindromeStrategy {
    @Override
    public boolean check(String input) {
        Stack<Character> stack = new Stack<>();
        // Push characters onto the stack
        for (char c : input.toCharArray()) {
            stack.push(c);
        }
        // Compare by popping
        for (char c : input.toCharArray()) {
            if (c != stack.pop()) return false;
        }
        return true;
    }
}

/**
 * Deque-based implementation of the strategy.
 * Compares front and rear elements.
 */
class DequeStrategy implements PalindromeStrategy {
    @Override
    public boolean check(String input) {
        Deque<Character> deque = new ArrayDeque<>();
        for (char c : input.toCharArray()) {
            deque.addLast(c);
        }
        // Compare until empty or one remains
        while (deque.size() > 1) {
            if (deque.removeFirst() != deque.removeLast()) return false;
        }
        return true;
    }
}

// Main App to demonstrate Polymorphism
public class PalindromeCheckerApp {
    public static void main(String[] args) {
        String input = "level";

        // Inject Stack Strategy at runtime
        PalindromeStrategy strategy = new StackStrategy();
        System.out.println("Using Stack Strategy:");
        printResult(input, strategy);

        // Inject Deque Strategy at runtime
        strategy = new DequeStrategy();
        System.out.println("\nUsing Deque Strategy:");
        printResult(input, strategy);
    }

    private static void printResult(String input, PalindromeStrategy strategy) {
        boolean result = strategy.check(input);
        System.out.println("Input : " + input);
        System.out.println("Is Palindrome? : " + result);
    }
}