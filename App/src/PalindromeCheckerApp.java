import java.util.LinkedList;
import java.util.Queue;
import java.util.Stack;

/**
 * Use Case 3: Reverse String Based Palindrome Check (Dynamic)
 * * This version takes input from the user, reverses it using a loop,
 * and compares the original with the reversed version.
 */
public class PalindromeCheckerApp {
    public static void main(String[] args) {
        // Declare and initialize the input string
        String input = "civic";

        // Create a Queue to store characters in FIFO order
        Queue<Character> queue = new LinkedList<>();

        // Create a Stack to store characters in LIFO order
        Stack<Character> stack = new Stack<>();

        // Insert each character into both queue and stack
        for (char c : input.toCharArray()) {
            queue.add(c);
            stack.push(c);
        }

        // Flag to track palindrome status
        boolean isPalindrome = true;

        // Compare characters until the queue becomes empty
        while (!queue.isEmpty()) {
            // FIFO (Queue) vs LIFO (Stack)
            if (queue.poll() != stack.pop()) {
                isPalindrome = false;
                break;
            }
        }

        System.out.println("Input : " + input);
        System.out.println("Is Palindrome? : " + isPalindrome);
    }
}