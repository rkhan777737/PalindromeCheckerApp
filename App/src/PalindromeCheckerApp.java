import java.util.Stack;

/**
 * Use Case 3: Reverse String Based Palindrome Check (Dynamic)
 * * This version takes input from the user, reverses it using a loop,
 * and compares the original with the reversed version.
 */
public class PalindromeCheckerApp {
    public static void main(String[] args) {
        // Declare and initialize the input string
        String input = "noon";

        // Create a Stack to store characters
        Stack<Character> stack = new Stack<>();

        // Push each character of the string into the stack
        for (char c : input.toCharArray()) {
            stack.push(c); // Adds characters in original order
        }

        // Assume palindrome initially
        boolean isPalindrome = true;

        // Iterate again through original string and compare with popped values
        for (char c : input.toCharArray()) {
            // Pop returns the top element (the last character pushed)
            if (c != stack.pop()) {
                isPalindrome = false;
                break;
            }
        }

        // Print result to console
        System.out.println("Input : " + input);
        System.out.println("Is Palindrome? : " + isPalindrome);
    }
}