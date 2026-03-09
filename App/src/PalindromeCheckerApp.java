/**
 * UC11: Object-Oriented Palindrome Service
 * This class encapsulates the logic for palindrome validation.
 */
class PalindromeService {

    /**
     * Exposes the palindrome check logic.
     * Uses an efficient two-pointer internal approach.
     */
    public boolean checkPalindrome(String input) {
        // Initialize pointers
        int start = 0;
        int end = input.length() - 1;

        // Compare characters moving inward
        while (start < end) {
            if (input.charAt(start) != input.charAt(end)) {
                return false;
            }
            start++;
            end--;
        }
        return true;
    }
}

public class PalindromeCheckerApp {
    public static void main(String[] args) {
        // Define the input string to validate
        String input = "racecar";

        // Create an instance of the PalindromeService (Encapsulation)
        PalindromeService service = new PalindromeService();

        // Call the encapsulated method
        boolean isPalindrome = service.checkPalindrome(input);

        // Output results to console
        System.out.println("Input : " + input);
        System.out.println("Is Palindrome? : " + isPalindrome);
    }
}